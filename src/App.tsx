import { useState } from 'react';
import IntakeForm from './components/IntakeForm';
import DigitalPresenceForm from './components/DigitalPresenceForm';
import ProfessionalFinancialForm from './components/ProfessionalFinancialForm';

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleNext = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleFinalSubmit = (data: any) => {
    const finalData = { ...formData, ...data };
    console.log('Final Submission:', finalData);
    alert('Onboarding Complete! Check console for data.');
    // Here you would typically send data to backend
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 1 && (
        <IntakeForm onNext={handleNext} />
      )}
      {step === 2 && (
        <DigitalPresenceForm
          onBack={handleBack}
          onSubmit={handleNext}
        />
      )}
      {step === 3 && (
        <ProfessionalFinancialForm
          onBack={handleBack}
          onSubmit={handleFinalSubmit}
        />
      )}
    </div>
  );
}

export default App;
