import bcrypt from 'bcryptjs';
import dbConnect from '../mongodb';
import User from '../models/User';
import Organization from '../models/Organization';
import Role from '../models/Role';
import Permission from '../models/Permission';
import RolePermission from '../models/RolePermission';
import OrganizationMember from '../models/OrganizationMember';
import FieldRule from '../models/FieldRule';
import { 
  DEFAULT_PERMISSIONS, 
  DEFAULT_ROLES, 
  DEFAULT_ROLE_PERMISSIONS,
  DEFAULT_FIELD_RULES 
} from './seed-data';

export async function seedRBAC() {
  await dbConnect();

  console.log('Seeding RBAC data...');

  // Always ensure admin user has correct role
  const existingAdmin = await User.findOne({ email: 'admin@mcapilot.com' });
  if (existingAdmin && existingAdmin.role !== 'admin') {
    await User.updateOne(
      { email: 'admin@mcapilot.com' },
      { $set: { role: 'admin' } }
    );
    console.log('Updated Super Admin user role to admin');
  }

  const existingPermissions = await Permission.countDocuments();
  if (existingPermissions > 0) {
    console.log('RBAC data already exists, skipping full seed.');
    return;
  }

  const permissions = await Permission.insertMany(DEFAULT_PERMISSIONS);
  console.log(`Created ${permissions.length} permissions`);

  const permissionMap = new Map(permissions.map(p => [p.key, p._id]));

  const roles = await Role.insertMany(DEFAULT_ROLES);
  console.log(`Created ${roles.length} roles`);

  const roleMap = new Map(roles.map(r => [r.key, r._id]));

  const rolePermissions = DEFAULT_ROLE_PERMISSIONS.map(rp => ({
    roleId: roleMap.get(rp.roleKey),
    permissionId: permissionMap.get(rp.permissionKey),
    scope: rp.scope,
    allowed: rp.allowed,
  })).filter(rp => rp.roleId && rp.permissionId);

  await RolePermission.insertMany(rolePermissions);
  console.log(`Created ${rolePermissions.length} role-permission mappings`);

  const fieldRules = DEFAULT_FIELD_RULES.map(fr => ({
    roleId: roleMap.get(fr.roleKey),
    resource: fr.resource,
    field: fr.field,
    access: fr.access,
  })).filter(fr => fr.roleId);

  if (fieldRules.length > 0) {
    await FieldRule.insertMany(fieldRules);
    console.log(`Created ${fieldRules.length} field rules`);
  }

  let platformOrg = await Organization.findOne({ type: 'PLATFORM' });
  if (!platformOrg) {
    platformOrg = await Organization.create({
      name: 'MCA Pilot Platform',
      type: 'PLATFORM',
      isActive: true,
    });
    console.log('Created Platform organization');
  }

  let superAdminUser = await User.findOne({ email: 'admin@mcapilot.com' });
  if (!superAdminUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    superAdminUser = await User.create({
      email: 'admin@mcapilot.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'admin',
      isActive: true,
      activeOrganizationId: platformOrg._id,
    });
    console.log('Created Super Admin user');
  } else if (superAdminUser.role !== 'admin') {
    await User.updateOne(
      { email: 'admin@mcapilot.com' },
      { $set: { role: 'admin' } }
    );
    console.log('Updated Super Admin user role');
  }

  const superAdminRole = await Role.findOne({ key: 'SUPER_ADMIN' });
  if (superAdminRole) {
    const existingMembership = await OrganizationMember.findOne({
      userId: superAdminUser._id,
      organizationId: platformOrg._id,
    });

    if (!existingMembership) {
      await OrganizationMember.create({
        userId: superAdminUser._id,
        organizationId: platformOrg._id,
        roleId: superAdminRole._id,
        isActive: true,
      });
      console.log('Created Super Admin membership in Platform org');
    }
  }

  console.log('RBAC seed complete!');
}

export async function resetRBAC() {
  await dbConnect();

  console.log('Resetting RBAC data...');

  await RolePermission.deleteMany({});
  await FieldRule.deleteMany({});
  await OrganizationMember.deleteMany({});
  await Role.deleteMany({});
  await Permission.deleteMany({});

  console.log('RBAC data cleared. Running seed...');
  await seedRBAC();
}
