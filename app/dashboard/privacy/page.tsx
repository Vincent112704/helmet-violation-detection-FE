'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Users, AlertTriangle, CheckCircle, Eye } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Privacy Policy</h1>
        <p className="text-gray-600">Philippine Data Privacy Act (RA 10173) Compliance</p>
      </div>

      {/* Compliance Banner */}
      <Card className="border-0 shadow bg-green-50 border-l-4 border-green-600">
        <CardContent className="pt-6 flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900">Compliant with Philippine Data Privacy Act</p>
            <p className="text-sm text-green-800 mt-1">
              This system is fully compliant with the Data Privacy Act of 2012 (RA 10173) and related regulations.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Purpose of Data Collection */}
          <Card className="border-0 shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-orange-600" />
                Purpose of Data Collection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <p>
                The Traffic Enforcement - Helmet Detection System collects and processes personal data for the following lawful purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Identification and monitoring of traffic violations (helmet non-compliance)</li>
                <li>Automated generation of violation tickets</li>
                <li>Traffic safety enforcement and compliance</li>
                <li>Statistical analysis and traffic management reporting</li>
                <li>Legal proceedings and dispute resolution</li>
              </ul>
            </CardContent>
          </Card>

          {/* 2. Data Collected */}
          <Card className="border-0 shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                Data Collected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">From Video Submissions:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                  <li>Video recordings of traffic violations</li>
                  <li>Vehicle license plate numbers (extracted via AI)</li>
                  <li>Date and time of violations</li>
                  <li>Location/area of violations</li>
                  <li>Officer identification and name</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">From User Accounts:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                  <li>Full name and email address</li>
                  <li>Officer ID and designation</li>
                  <li>Login credentials (securely hashed)</li>
                  <li>Access logs and activity timestamps</li>
                </ul>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs font-semibold text-yellow-900 mb-1">Note on Video Data:</p>
                <p className="text-xs text-yellow-800">
                  While videos may contain identifiable persons, they are processed strictly for enforcement purposes. Personal data is extracted and anonymized during processing.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. Legal Basis */}
          <Card className="border-0 shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                Legal Basis for Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <p className="font-semibold">Under Article III of the Data Privacy Act (RA 10173):</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong>Legal Obligation:</strong> Processing is necessary to comply with laws on traffic safety and road regulation enforcement.
                </li>
                <li>
                  <strong>Public Interest:</strong> Traffic violation enforcement is a legitimate government function conducted in the public interest.
                </li>
                <li>
                  <strong>Official Authority:</strong> The system is operated by authorized traffic management agencies with proper jurisdiction.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 4. Data Recipients */}
          <Card className="border-0 shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-600" />
                Data Recipients and Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <p>Personal data may be disclosed to the following entities:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Traffic management supervisors and administrators (system access)</li>
                <li>Local Government Units (LGUs) for enforcement purposes</li>
                <li>Judiciary and law enforcement agencies (legal proceedings)</li>
                <li>Vehicle registration authorities (for vehicle owner identification)</li>
                <li>Appeals committees and dispute resolution bodies</li>
              </ul>
              <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
                Data will NOT be sold, rented, or shared with commercial entities without explicit legal authorization.
              </p>
            </CardContent>
          </Card>

          {/* 5. Data Security */}
          <Card className="border-0 shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-600" />
                Data Security and Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <p>We implement security measures in accordance with Article V of the Data Privacy Act:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Access controls and role-based permissions</li>
                <li>Encrypted data transmission (HTTPS/SSL)</li>
                <li>Secure database storage with encryption</li>
                <li>Regular security audits and monitoring</li>
                <li>Staff training on data privacy and protection</li>
                <li>Incident response procedures</li>
              </ul>
            </CardContent>
          </Card>

          {/* 6. Data Retention */}
          <Card className="border-0 shadow">
            <CardHeader>
              <CardTitle>Data Retention Period</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <div className="space-y-2">
                <p>
                  <strong>Active Records:</strong> Violation records are retained for 5 years from the date of violation, in compliance with government record-keeping regulations.
                </p>
                <p>
                  <strong>Video Data:</strong> Original video files are retained for 90 days or until legal proceedings conclude, whichever is longer. After processing, raw videos may be deleted.
                </p>
                <p>
                  <strong>Appeal Records:</strong> Extended retention for records with pending or active appeals.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 7. Data Subject Rights */}
          <Card className="border-0 shadow">
            <CardHeader>
              <CardTitle>Your Privacy Rights (Data Subject Rights)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <p>Under Article III of the Data Privacy Act, you have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong>Right to be Informed:</strong> You have the right to know what personal data is collected and how it will be used.
                </li>
                <li>
                  <strong>Right of Access:</strong> You may request access to your personal data and information about how it is processed.
                </li>
                <li>
                  <strong>Right to Rectification:</strong> You may correct inaccurate or incomplete personal data.
                </li>
                <li>
                  <strong>Right to Object:</strong> You may object to processing of your data on legitimate grounds.
                </li>
                <li>
                  <strong>Right to Lodge a Complaint:</strong> You may file a complaint with the National Privacy Commission (NPC).
                </li>
              </ul>
              <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
                To exercise these rights, contact: privacy@traffic-enforcement.gov.ph
              </p>
            </CardContent>
          </Card>

          {/* 8. Contact and Complaints */}
          <Card className="border-0 shadow bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                Privacy Concerns and Complaints
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="text-blue-900">
                <p>
                  <strong>Data Protection Officer:</strong>
                  <br />
                  Email: dpo@traffic-enforcement.gov.ph
                </p>
                <p className="mt-2">
                  <strong>National Privacy Commission (Philippines):</strong>
                  <br />
                  Website: www.privacy.gov.ph
                  <br />
                  Email: inquiries@privacy.gov.ph
                  <br />
                  Address: National Privacy Commission, Thanh Building, 46 Paseo de Santa Rosa, Makati City
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Quick Reference */}
        <div className="space-y-4">
          {/* Key Points */}
          <Card className="border-0 shadow">
            <CardHeader>
              <CardTitle className="text-lg">Key Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Data Controller</p>
                <p className="text-sm text-gray-900">Traffic Management Office</p>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Legal Framework</p>
                <p className="text-sm text-gray-900">RA 10173 (Data Privacy Act)</p>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Compliance Officer</p>
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Designated</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <Card className="border-0 shadow">
            <CardContent className="pt-6">
              <p className="text-xs text-gray-600">
                <strong>Last Updated:</strong> January 2024
              </p>
              <p className="text-xs text-gray-600 mt-2">
                This policy is subject to updates. Users will be notified of material changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
