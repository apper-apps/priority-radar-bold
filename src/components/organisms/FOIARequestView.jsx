import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { foiaRequestService } from "@/services/api/foiaRequestService";
import { toast } from "react-toastify";

const FOIARequestView = () => {
  const [formData, setFormData] = useState({
    requestTitle: "",
    requestDescription: "",
    specificDocuments: "",
    authorityType: "",
    authorityName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    urgency: "normal",
    purpose: "personal"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authorityTypes = [
    { value: "ministry", label: "Minisztérium" },
    { value: "municipality", label: "Önkormányzat" },
    { value: "government_office", label: "Kormányhivatal" },
    { value: "public_company", label: "Közszolgáltató" },
    { value: "university", label: "Állami Egyetem" },
    { value: "hospital", label: "Állami Egészségügyi Intézmény" },
    { value: "other", label: "Egyéb közszerv" }
  ];

  const urgencyOptions = [
    { value: "normal", label: "Normál (30 nap)", icon: "Clock" },
    { value: "urgent", label: "Sürgős (15 nap)", icon: "Zap" },
    { value: "immediate", label: "Azonnali (8 nap)", icon: "AlertTriangle" }
  ];

  const purposeOptions = [
    { value: "personal", label: "Személyes érdek" },
    { value: "research", label: "Kutatás" },
    { value: "journalism", label: "Újságírás" },
    { value: "legal", label: "Jogi eljárás" },
    { value: "public_interest", label: "Közérdek" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const request = await foiaRequestService.create(formData);
      toast.success("Adatigénylés sikeresen beküldve! Referencia szám: " + request.referenceNumber);
      
      // Reset form
      setFormData({
        requestTitle: "",
        requestDescription: "",
        specificDocuments: "",
        authorityType: "",
        authorityName: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        urgency: "normal",
        purpose: "personal"
      });
    } catch (error) {
      toast.error("Hiba történt a beküldés során. Kérjük próbálja újra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-primary-100 rounded-xl">
            <ApperIcon name="FileText" size={32} className="text-primary-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 font-display">
          Közérdekű Adatigénylő Platform
        </h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Kérjen információkat a közintézmények és hatóságok működésével kapcsolatban. 
          Az adatigénylési jog alapján minden állampolgár jogosult betekinteni a közérdekű adatokba.
        </p>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-3 gap-4 mb-8"
      >
        <Card className="p-4 text-center">
          <ApperIcon name="Shield" size={24} className="text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold text-neutral-900">Jogi védelem</h3>
          <p className="text-sm text-neutral-600 mt-1">Jogszabály szerint védett folyamat</p>
        </Card>
        <Card className="p-4 text-center">
          <ApperIcon name="Clock" size={24} className="text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold text-neutral-900">Határidő</h3>
          <p className="text-sm text-neutral-600 mt-1">Maximum 30 napon belül válasz</p>
        </Card>
        <Card className="p-4 text-center">
          <ApperIcon name="Lock" size={24} className="text-purple-600 mx-auto mb-2" />
          <h3 className="font-semibold text-neutral-900">Adatvédelem</h3>
          <p className="text-sm text-neutral-600 mt-1">Személyes adatok védve</p>
        </Card>
      </motion.div>

      {/* Request Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Request Details Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-200">
                <ApperIcon name="FileText" size={20} className="text-primary-600" />
                <h2 className="text-xl font-semibold text-neutral-900 font-display">
                  Az igényelt információ részletei
                </h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Kérés címe <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Rövid, szemléletes címe az adatigénylésnek"
                  value={formData.requestTitle}
                  onChange={(e) => handleInputChange("requestTitle", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Részletes leírás <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Írja le részletesen, hogy milyen információkra van szüksége és miért..."
                  value={formData.requestDescription}
                  onChange={(e) => handleInputChange("requestDescription", e.target.value)}
                  rows={4}
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Minél pontosabb a leírás, annál gyorsabb és pontosabb válaszra számíthat.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Konkrét dokumentumok/adatok (opcionális)
                </label>
                <Textarea
                  placeholder="Ha ismeri a konkrét dokumentumok nevét, ügyiratszámát, időszakát..."
                  value={formData.specificDocuments}
                  onChange={(e) => handleInputChange("specificDocuments", e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Authority Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-200">
                <ApperIcon name="Building" size={20} className="text-primary-600" />
                <h2 className="text-xl font-semibold text-neutral-900 font-display">
                  Megkeresett szerv adatai
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Szerv típusa <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.authorityType}
                    onChange={(e) => handleInputChange("authorityType", e.target.value)}
                    required
                  >
                    <option value="">Válasszon típust...</option>
                    {authorityTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Szerv pontos neve <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="pl. Budapest Főváros V. kerület Önkormányzata"
                    value={formData.authorityName}
                    onChange={(e) => handleInputChange("authorityName", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-200">
                <ApperIcon name="User" size={20} className="text-primary-600" />
                <h2 className="text-xl font-semibold text-neutral-900 font-display">
                  Kapcsolattartó adatok
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Teljes név <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Vezetéknév Keresztnév"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange("contactName", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    E-mail cím <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="pelda@email.hu"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Telefonszám (opcionális)
                  </label>
                  <Input
                    placeholder="+36 20 123 4567"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Request Options */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-200">
                <ApperIcon name="Settings" size={20} className="text-primary-600" />
                <h2 className="text-xl font-semibold text-neutral-900 font-display">
                  Kérés beállításai
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Sürgősségi kategória
                  </label>
                  <div className="space-y-2">
                    {urgencyOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          formData.urgency === option.value
                            ? "border-primary-500 bg-primary-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="urgency"
                          value={option.value}
                          checked={formData.urgency === option.value}
                          onChange={(e) => handleInputChange("urgency", e.target.value)}
                          className="sr-only"
                        />
                        <ApperIcon 
                          name={option.icon} 
                          size={16} 
                          className={formData.urgency === option.value ? "text-primary-600" : "text-neutral-400"} 
                        />
                        <span className="text-sm font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Igénylés célja
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.purpose}
                    onChange={(e) => handleInputChange("purpose", e.target.value)}
                  >
                    {purposeOptions.map(purpose => (
                      <option key={purpose.value} value={purpose.value}>
                        {purpose.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-neutral-700">
                  <p className="font-medium mb-2">Jogszabályi információk:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Az adatigénylés ingyenes, kivéve a másolási költségeket</li>
                    <li>A szerv 30 napon belül köteles válaszolni (sürgős esetben 15-8 nap)</li>
                    <li>Elutasítás esetén indoklás és jogorvoslati tájékoztatás jár</li>
                    <li>Személyes adatokat csak a szükséges mértékben dolgozzuk fel</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.requestTitle || !formData.requestDescription || !formData.authorityType || !formData.authorityName || !formData.contactName || !formData.contactEmail}
                className="w-full md:w-auto px-8 py-3"
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Beküldés folyamatban...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Send" size={20} className="mr-2" />
                    Adatigénylés beküldése
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default FOIARequestView;