'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, FileText, DollarSign, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const stats = [
  {
    title: 'Active Deals',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: TrendingUp,
    color: 'blue',
  },
  {
    title: 'Documents Pending',
    value: '8',
    change: '-3%',
    trend: 'down',
    icon: FileText,
    color: 'orange',
  },
  {
    title: 'Total Funded',
    value: '$1.2M',
    change: '+24%',
    trend: 'up',
    icon: DollarSign,
    color: 'green',
  },
  {
    title: 'Team Members',
    value: '12',
    change: '+2',
    trend: 'up',
    icon: Users,
    color: 'purple',
  },
];

const recentDeals = [
  { id: 1, business: 'Acme Restaurant LLC', amount: '$75,000', status: 'Funded', date: '2 hours ago' },
  { id: 2, business: 'Quick Mart Inc', amount: '$45,000', status: 'Pending', date: '5 hours ago' },
  { id: 3, business: 'City Auto Repair', amount: '$120,000', status: 'Under Review', date: '1 day ago' },
  { id: 4, business: 'Downtown Fitness', amount: '$85,000', status: 'Documents Needed', date: '2 days ago' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s your overview.</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      stat.color === 'blue'
                        ? 'bg-blue-100'
                        : stat.color === 'orange'
                        ? 'bg-orange-100'
                        : stat.color === 'green'
                        ? 'bg-green-100'
                        : 'bg-purple-100'
                    }`}
                  >
                    <stat.icon
                      className={`w-6 h-6 ${
                        stat.color === 'blue'
                          ? 'text-blue-600'
                          : stat.color === 'orange'
                          ? 'text-orange-600'
                          : stat.color === 'green'
                          ? 'text-green-600'
                          : 'text-purple-600'
                      }`}
                    />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Business</th>
                    <th className="pb-3 font-medium hidden sm:table-cell">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeals.map((deal) => (
                    <motion.tr
                      key={deal.id}
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                      className="border-b last:border-0"
                    >
                      <td className="py-4">
                        <p className="font-medium">{deal.business}</p>
                        <p className="text-sm text-gray-500 sm:hidden">{deal.amount}</p>
                      </td>
                      <td className="py-4 hidden sm:table-cell">{deal.amount}</td>
                      <td className="py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            deal.status === 'Funded'
                              ? 'bg-green-100 text-green-700'
                              : deal.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : deal.status === 'Under Review'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {deal.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-500 hidden md:table-cell">{deal.date}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
