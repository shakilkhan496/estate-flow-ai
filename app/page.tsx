import Link from "next/link";
import { FileText, Users, TrendingUp, Shield, Zap, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MCA Pilot</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              The Complete CRM for
              <span className="text-blue-600"> MCA Brokers</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Track deals from application to funding. Manage documents, automate underwriting, 
              and close more deals with the industry's most powerful merchant cash advance platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                href="#features"
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
              >
                See Features
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Everything You Need to Close More Deals
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Powerful features designed specifically for MCA brokers and ISOs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Deal Pipeline"
                description="Track every deal from application to funding with visual pipeline management. Never lose track of an opportunity."
              />
              <FeatureCard
                icon={<FileText className="w-6 h-6" />}
                title="Document Management"
                description="Centralize all deal documents. Auto-rename bank statements, compress files, and share with lenders instantly."
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="AI Underwriting"
                description="One-click AI analysis of bank statements. Extract revenue, NSFs, daily balances, and existing positions automatically."
              />
              <FeatureCard
                icon={<Users className="w-6 h-6" />}
                title="Team Management"
                description="Assign deals to originators and closers. Control visibility and track performance across your organization."
              />
              <FeatureCard
                icon={<BarChart3 className="w-6 h-6" />}
                title="Offers Pipeline"
                description="Manage lender offers visually. Track from approval to contracts to funding with status-based workflows."
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6" />}
                title="Role-Based Access"
                description="Control who sees what with granular permissions. Admins, managers, brokers, and users each see what they need."
              />
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Ready to Transform Your MCA Business?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Join hundreds of brokers already using MCA Pilot to close more deals faster.
            </p>
            <Link
              href="/auth/signup"
              className="mt-8 inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MCA Pilot</span>
          </div>
          <p className="mt-4 sm:mt-0 text-gray-500">
            &copy; {new Date().getFullYear()} MCA Pilot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
