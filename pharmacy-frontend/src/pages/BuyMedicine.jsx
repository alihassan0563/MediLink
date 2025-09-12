
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Header from "../component/Header";
import "./BuyMedicine.css";
 

const initialMedicine = { 
  name: "", 
  type: "", 
  strength: "", 
  quantity: 1 
};

const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Sialkot"];

const medicineTypes = ["Tablet", "Capsule", "Syrup", "Injection", "Cream/Ointment", "Drop"];

// Sample brand names for autosuggest (replace with API/DB in production)
const medicineSuggestions = [
  // Analgesics / Antipyretics
  "Panadol", "Panadol Extra", "Calpol", "Disprin", "Brufen", "Ponstan", "Voltaren", "Naprosyn",
  // Antibiotics
  "Augmentin", "Amoxil", "Klavox", "Ciproxin", "Ciplox", "Flagyl", "Zinnat", "Cefspan", "Keflex", "Levoxin", "Avelox", "Klacid", "Azomax", "Azithral",
  // Antihistamines / Allergy
  "Zyrtec", "Claritin", "Telfast", "Telekast", "Aerius",
  // Gastrointestinal
  "Losec", "Nexium", "Esso", "Motilium", "Gaviscon", "Buscopan", "ORS",
  // Antihelmintics
  "Zentel", "Vermox",
  // Cardiometabolic / Chronic
  "Norvasc", "Concor", "Loprin", "Lipitor", "Crestor", "Glucophage", "Amaryl", "Diamicron",
  // Others common
  "Caltrate", "Neurobion", "Evion", "Folidic",
  "Panadol", "Panadol Extra", "Panadol CF", "Panadol Cold & Flu", "Calpol", "Disprin", "Aspirin", 
"Brufen", "Ponstan", "Ponstan Forte", "Mefac", "Nuberol Forte", "Nuberol", "Nimcofen", 
"Cataflam", "Voltaren", "Arinac", "Arinac Forte", "Arinac Syrup", "Arinac Tablet", 
"Synflex", "Naprosyn", "Flex", "Myogesic", "Spasrid", "Duspatalin", "Buscopan", 
"Spasmonal", "Spasrid Forte", "Inderal", "Atenolol", "Tenormin", "Capoten", "Envas", 
"Cozaar", "Losar", "Ampress", "Norvasc", "Azomax", "Zithromax", "Clarithro", "Klaricid", 
"Erythrocin", "Flagyl", "Metrogyl", "Amoxil", "Augmentin", "Hiconcil", "Klavox", "Cefspan", 
"Suprax", "Velosef", "Keflex", "Keflor", "Zinnat", "Cefizox", "Fortum", "Maxipime", "Meronem", 
"Tienam", "Claforan", "Rocephin", "Ceftriaxone", "Cefotaxime", "Cefixime", "Cefuroxime", 
"Cefaclor", "Cefadroxil", "Duricef", "Roxid", "Maclar", "Tavanic", "Levoxin", "Levoflox", 
"Oflox", "Tarivid", "Avelox", "Moxiget", "Ciproxin", "Ciprotab", "Ciproflox", "Sparaxin", 
"Glimet", "Glucophage", "Metformin", "Amaryl", "Diamicron", "Daonil", "Insulatard", 
"Mixtard", "Actrapid", "Novorapid", "Humulin", "Lantus", "Tresiba", "Januvia", 
"Galvus", "Trajenta", "Jardiance", "Forxiga", "Xigduo", "Invokana", "Lipiget", 
"Atorva", "Atorvast", "Lipitor", "Crestor", "Rosuva", "Zocor", "Simva", "Ezetrol", 
"Omezol", "Losec", "Nexum", "Nexium", "Esomac", "Somac", "Pantoloc", "Pantosec", 
"Rabecid", "Rabipur", "Lanzol", "Lanzor", "Maxolon", "Motilium", "Domel", "Domperidone", 
"Zofran", "Emetil", "Primperan", "Stemetil", "Cinnarizine", "Stugeron", "Avil", 
"Phenergan", "Telfast", "Fexet", "Claritek", "Claritin", "Loratadine", "Cetrizine", 
"Zyrtec", "Xyzal", "Levocet", "Histaloc", "Histacin", "Deltacortril", "Prednisolone", 
"Solu-Medrol", "Medrol", "Hydrocort", "Dexamethasone", "Decadron", "Betnesol", "Celestone", 
"Kenacort", "Depo-Medrol", "Omnacortil", "Ventolin", "Salamol", "Asmalin", "Bricanyl", 
"Seretide", "Symbicort", "Pulmicort", "Beclate", "Flixotide", "Singulair", "Montiget",
"Proventil", "Ventorlin", "Deriphyllin", "Theo-Asthalin", "Theolin", "Astymin", "Neurobion", 
"Mecobal", "Mecobalamin", "Nervin", "Cyanocobalamin", "Folic Acid", "Folvite", "Folvite Plus", 
"Obimin", "Pregnacare", "Elevit", "Caltrate", "Osteocare", "Calcimax", "Calcium Sandoz", 
"Vitrum", "Centrum", "Surbex Z", "Surbex T", "Surbex XT", "Surbex Plus", "Vitazet", 
"Vidaylin", "Vidaylin M", "Vidaylin Drops", "Vidaylin Syrup", "Becosules", "Bevidox", 
"Bevidox Forte", "Polyvit", "Polyvit Drops", "Polyvit Syrup", "Peditral", "ORS Sachets", 
"Pedialyte", "Rehydron", "Hydralyte", "Glytin", "ORS Loly", "ORS Plus", "ORS Hydral", 
"ORS Rehydrate", "ORS Max", "ORS Solution", "ORS Herbal", "ORS Apple", "ORS Orange", 
"ORS Lemon", "ORS Strawberry", "ORS Kids", "ORS Lite", "ORS Active", "ORS Glucose", 
"ORS Rapid", "ORS Energy", "ORS Balanced", "ORS Pro", "ORS Relief", "ORS Restore", 
"ORS Vital", "ORS Electrolyte", "ORS Hydrate", "ORS Strong", "ORS Boost", "ORS Mix", 
"ORS Vita", "ORS Mineral", "ORS Hydromax", "ORS Fast", "ORS Cool", "ORS Standard", 
"ORS Natural", "ORS Fresh", "ORS Smart", "ORS Pack", "ORS Tabs", "ORS Powder", 
"ORS Sachet Lemon", "ORS Sachet Orange", "ORS Sachet Cola", "ORS Sachet Apple", 
"ORS Sachet Strawberry", "ORS Sachet Mango", "ORS Sachet Peach", "ORS Sachet Pineapple", 
"ORS Sachet Grape", "ORS Sachet Mixed Fruit", "ORS Sachet Banana", "ORS Sachet Cherry", 
"ORS Sachet Melon", "ORS Sachet Coconut", "ORS Sachet Blueberry", "ORS Sachet Pomegranate", 
"ORS Sachet Watermelon", "ORS Sachet Citrus", "ORS Sachet Berry", "ORS Sachet Fruit Punch", 
"ORS Sachet Green Apple", "ORS Sachet Lemon Lime", "ORS Sachet Orange Mango", "ORS Sachet Tropical", 
"ORS Sachet Guava", "ORS Sachet Passion Fruit", "ORS Sachet Kiwi", "ORS Sachet Lychee", 
"ORS Sachet Dragon Fruit", "ORS Sachet Mixed Berries", "ORS Sachet Raspberry", "ORS Sachet Blackcurrant", 
"ORS Sachet Energy", "ORS Sachet Electro Plus", "ORS Sachet Sport", "ORS Sachet Kidz", "ORS Sachet Junior", 
"ORS Sachet Senior", "ORS Sachet Women", "ORS Sachet Men", "ORS Sachet Active Plus", "ORS Sachet Lite", 
"ORS Sachet Zero", "ORS Sachet Max", "ORS Sachet Pro", "ORS Sachet Essential", "ORS Sachet Strong", 
"ORS Sachet Vital", "ORS Sachet Restore", "ORS Sachet Hydrate", "ORS Sachet Relief", "ORS Sachet Rebalance", 
"ORS Sachet Energy Max", "ORS Sachet Hydration", "ORS Sachet Wellness", "ORS Sachet Care", "ORS Sachet Immunity",
"Augmentin", "Amoxil", "Klavox", "Velosef", "Suprax", "Zinnat", "Rocephin", "Cefspan", 
"Fortum", "Meronem", "Tienam", "Claforan", "Flagyl", "Metrogyl", "Tinidazole", 
"Azomax", "Zithromax", "Klaricid", "Erythrocin", "Tavanic", "Levoxin", "Ciproxin", 
"Tarivid", "Moxiget", "Roxid", "Doxy", "Vibramycin", "Minocin", "Rifadin", "AKT-4", 
"Ethambutol", "PZA", "Isoniazid", "XDR-TB Kit", "Sofosbuvir", "Epclusa", "Harvoni", 
"Velpatasvir", "Ribavirin", "Tenofovir", "Lamivudine", "Efavirenz", "Nevirapine", 
"Kaletra", "Darunavir", "Raltegravir", "Dolutegravir", "Remdesivir", "Hydroxychloroquine", 
"Plaquenil", "Quinine", "Malarone", "Coartem", "Fansidar", "Primaquine", "Chloroquine", 
"Panadol", "Disprin", "Brufen", "Ponstan", "Cataflam", "Voltaren", "Naproxen", 
"Synflex", "Nuberol Forte", "Myogesic", "Flex", "Tramal", "Ultracet", "Dolgit", 
"Inderal", "Tenormin", "Capoten", "Envas", "Cozaar", "Losar", "Ampress", "Norvasc", 
"Amlocard", "Concor", "Cardura", "Aldactone", "Lasix", "Frusemide", "Zestril", 
"Prinivil", "Lipiget", "Atorva", "Lipitor", "Crestor", "Rosuva", "Zocor", "Simva", 
"Ezetrol", "Glucophage", "Amaryl", "Diamicron", "Daonil", "Januvia", "Galvus", 
"Trajenta", "Forxiga", "Jardiance", "Xigduo", "Insulatard", "Mixtard", "Actrapid", 
"Novorapid", "Humulin", "Lantus", "Tresiba", "Omezol", "Losec", "Nexium", "Esomac", 
"Somac", "Pantoloc", "Pantosec", "Rabecid", "Lanzol", "Maxolon", "Motilium", 
"Domel", "Zofran", "Stemetil", "Cinnarizine", "Stugeron", "Avil", "Phenergan", 
"Telfast", "Fexet", "Claritek", "Claritin", "Loratadine", "Zyrtec", "Xyzal", "Histaloc", 
"Deltacortril", "Prednisolone", "Medrol", "Decadron", "Betnesol", "Celestone", 
"Depo-Medrol", "Ventolin", "Salamol", "Bricanyl", "Seretide", "Symbicort", "Pulmicort", 
"Beclate", "Flixotide", "Singulair", "Montiget", "Astymin", "Neurobion", "Mecobal", 
"Surbex Z", "Surbex T", "Surbex XT", "Centrum", "Vitrum", "Osteocare", "Caltrate", 
"Calcimax", "Folvite", "Obimin", "Pregnacare", "Elevit", "Vitazet", "Vidaylin", 
"Becosules", "Bevidox", "Polyvit", "ORS Sachets", "Pedialyte", "Hydralyte", 
"ORS Plus", "ORS Kids", "ORS Pro", "ORS Vital", "ORS Restore", "ORS Hydrate", 
"ORS Strong", "ORS Boost", "ORS Tabs", "ORS Powder",
"Augmentin DS", "Klaricid XL", "Zithromax Suspension", "Amoxil Syrup", "Velosef Syrup", 
"Cefspan DS", "Suprax Suspension", "Zinnat Syrup", "Rocephin Injection", "Claforan Injection", 
"Fortum Injection", "Meronem Injection", "Flagyl Suspension", "Metrogyl Infusion", "Tinidazole Tablet", 
"Doxycap", "Vibramycin Syrup", "Minocin Capsule", "Rifadin Capsule", "Ethambutol Tablet", 
"PZA Tablet", "Isoniazid Tablet", "AKT Kit", "Coartem DS", "Fansidar Tablet", 
"Primaquine Tablet", "Chloroquine Tablet", "Hydroxychloroquine Tablet", "Remdesivir Injection", 
"Sofosbuvir Tablet", "Epclusa Tablet", "Harvoni Tablet", "Velpatasvir Tablet", "Tenofovir Tablet", 
"Lamivudine Tablet", "Efavirenz Tablet", "Nevirapine Tablet", "Kaletra Tablet", "Darunavir Tablet", 
"Raltegravir Tablet", "Dolutegravir Tablet", "Panadol CF", "Panadol Night", "Panadol Children", 
"Disprin Regular", "Disprin CV", "Brufen Syrup", "Ponstan Forte Suspension", "Cataflam D", 
"Voltaren SR", "Synflex DS", "Nuberol Injection", "Flex Capsule", "Tramal Injection", 
"Ultracet Tablet", "Dolgit Gel", "Inderal LA", "Tenormin Tablet", "Capoten Tablet", 
"Envas Tablet", "Cozaar DS", "Losar H", "Ampress Plus", "Norvasc 5mg", "Amlocard 10mg", 
"Concor AM", "Cardura XL", "Aldactone 25", "Lasix Injection", "Zestril Tablet", 
"Prinivil Tablet", "Lipiget 20mg", "Atorva 40mg", "Lipitor 10mg", "Crestor 20mg", 
"Rosuva 10mg", "Zocor 20mg", "Simva 10mg", "Ezetrol Tablet", "Glucophage XR", 
"Amaryl M", "Diamicron MR", "Daonil Tablet", "Januvia 100", "Galvus Met", "Trajenta Duo", 
"Forxiga Tablet", "Jardiance 25", "Xigduo Tablet", "Insulatard Flexpen", "Mixtard Flexpen", 
"Actrapid Flexpen", "Novorapid Flexpen", "Humulin R", "Lantus Solostar", "Tresiba Flexpen", 
"Omezol Capsule", "Losec MUPS", "Nexium Sachet", "Esomac Tablet", "Somac IV", 
"Pantoloc Tablet", "Pantosec Capsule", "Rabecid Capsule", "Lanzol Tablet", 
"Maxolon Injection", "Motilium Suspension", "Domel Suspension", "Zofran IV", 
"Stemetil Injection", "Cinnarizine Tablet", "Stugeron Forte", "Avil Injection", 
"Phenergan Syrup", "Telfast 120mg", "Fexet 180mg", "Claritek Syrup", "Claritin Reditabs", 
"Loratadine Syrup", "Zyrtec Syrup", "Xyzal Drops", "Histaloc Syrup", "Deltacortril 5mg", 
"Prednisolone Syrup", "Medrol Dose Pack", "Decadron Injection", "Betnesol Injection", 
"Celestone Chronodose", "Depo-Medrol Injection", "Ventolin Inhaler", "Salamol Inhaler", 
"Bricanyl Syrup", "Seretide Accuhaler", "Symbicort Turbuhaler", "Pulmicort Respules", 
"Beclate Inhaler", "Flixotide Inhaler", "Singulair Tablet", "Montiget Chewable", 
"Astymin Injection", "Neurobion Injection", "Mecobal Capsules", "Surbex Gold", 
"Surbex Zinc", "Surbex Iron", "Centrum Silver", "Centrum Men", "Centrum Women", 
"Vitrum Kids", "Osteocare Syrup", "Caltrate D", "Calcimax Syrup", "Folvite Forte", 
"Obimin Plus", "Pregnacare Max", "Elevit Women", "Vitazet Forte", "Vidaylin M Syrup", 
"Becosules Z", "Bevidox Syrup", "Polyvit Drops", "ORS Sachets Orange", 
"Pedialyte Apple", "Hydralyte Sachets", "ORS Kids Orange", "ORS Pro Lemon", 
"ORS Restore Sachets", "ORS Hydrate Pack", "ORS Strong Sachets", "ORS Tabs Orange", 
"ORS Powder Lemon", "ORS Vita Sachets",




];

const BuyMedicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [currentMedicine, setCurrentMedicine] = useState({ ...initialMedicine });
  const [nameError, setNameError] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { customer } = useAuth();
  const [submitErrors, setSubmitErrors] = useState([]);
  
  

  React.useEffect(() => {
    setTimeout(() => setFormVisible(true), 100);
    if (customer && customer.name) setCustomerName(customer.name);
  }, [customer]);

  const handleCurrentMedicineChange = (field, value) => {
    if (field === "name" && nameError) {
      setNameError(false);
    }
    setCurrentMedicine(prev => ({ ...prev, [field]: value }));
  };

  const addMedicine = () => {
    if (!currentMedicine.name || !currentMedicine.name.trim()) {
      setNameError(true);
      return;
    }
    setMedicines(prev => [...prev, { ...currentMedicine }]);
    setCurrentMedicine({ ...initialMedicine });
    setShowSuggestions(false);
  };

  const removeMedicine = (indexToRemove) => {
    setMedicines(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleMedicineNameChange = (value) => {
    handleCurrentMedicineChange("name", value);
    
    if (value.length > 1) {
      const q = value.toLowerCase();
      const starts = [];
      const contains = [];
      medicineSuggestions.forEach(med => {
        const m = med.toLowerCase();
        if (m.startsWith(q)) starts.push(med);
        else if (m.includes(q)) contains.push(med);
      });
      const filtered = [...new Set([...starts, ...contains])].slice(0, 10);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    handleCurrentMedicineChange("name", suggestion);
    setShowSuggestions(false);
  };

  // AI prescription feature removed

  const getSubmitErrors = () => {
    const errors = [];
    if (medicines.length === 0) errors.push("Please add at least one medicine.");
    if (!city) errors.push("Please select a city.");
    if (!address.trim()) errors.push("Please enter your address.");
    if (!/^03[0-9]{9}$/.test(phone)) errors.push("Please enter a valid phone number (03XXXXXXXXX).");
    return errors;
  };

  React.useEffect(() => {
    if (submitErrors.length > 0) {
      setSubmitErrors(getSubmitErrors());
    }
  }, [medicines, city, address, phone]);

  const isSubmitDisabled =
    medicines.length === 0 ||
    !city ||
    !address.trim() ||
    !/^03[0-9]{9}$/.test(phone);

  return (
    <div className="buy-medicine-bg">
      <Header />
      <div className="buy-medicine-container">
        <div className={`buy-medicine-inner ${formVisible ? "form-visible" : ""}`}>
          <h2 className="buy-medicine-title">Order Medicines</h2>
          <form className="buy-medicine-form" autoComplete="off">
            <div className="two-column-layout">
              {/* Left Column - Medicine Selection */}
              <div className="left-column">
                <div className="form-section">
                  <label className="form-label">Medicines List</label>
                  <div className="medicine-card">
                      <div className="medicine-row">
                        <div className="medicine-name-container">
                          <input
                          className={`medicine-input${nameError ? " input-error" : ""}`}
                            type="text"
                            placeholder="Medicine Name"
                          value={currentMedicine.name}
                          onChange={e => handleMedicineNameChange(e.target.value)}
                          onFocus={() => currentMedicine.name.length > 1 && setShowSuggestions(true)}
                            required
                          />
                        {nameError && (
                          <div className="error-text">Add medicine</div>
                        )}
                          {showSuggestions && suggestions.length > 0 && (
                            <div className="suggestions-dropdown">
                              {suggestions.map((suggestion, suggestionIdx) => (
                                <div
                                  key={suggestionIdx}
                                  className="suggestion-item"
                                onClick={() => selectSuggestion(suggestion)}
                                >
                                  {suggestion}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="medicine-details">
                        <div className="medicine-field">
                          <label className="field-label">Type</label>
                          <select
                            className="medicine-select"
                          value={currentMedicine.type}
                          onChange={e => handleCurrentMedicineChange("type", e.target.value)}
                          >
                            <option value="">Select Type</option>
                            {medicineTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div className="medicine-field">
                          <label className="field-label">Strength/Dosage</label>
                          <input
                            className="medicine-input-small"
                            type="text"
                            placeholder="e.g., 500mg, 5ml"
                          value={currentMedicine.strength}
                          onChange={e => handleCurrentMedicineChange("strength", e.target.value)}
                          />
                        </div>
                        <div className="medicine-field medicine-qty-actions">
                          <label className="field-label">Quantity</label>
                            <input
                              className="medicine-qty"
                              type="number"
                              min="1"
                          value={currentMedicine.quantity}
                          onChange={e => handleCurrentMedicineChange("quantity", e.target.value)}
                              required
                            />
                      </div>
                      <div className="medicine-actions">
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeMedicine(medicines.length - 1)}
                          disabled={medicines.length === 0}
                          title="Remove last medicine"
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          className="add-btn"
                          onClick={addMedicine}
                          title="Add Medicine"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {medicines.length > 0 && (
                      <div className="added-medicine-list">
                        <div className="added-medicine-header">
                          <span>Medicine</span>
                          <span>Type</span>
                          <span>Strength</span>
                          <span>Qty</span>
                          <span>Action</span>
                        </div>
                        <ul>
                          {medicines.map((m, i) => (
                            <li key={`${m.name}-${i}`} className="added-medicine-item">
                              <span className="added-medicine-name">{m.name || "Unnamed"}</span>
                              <span className="added-medicine-meta">{m.type || "-"}</span>
                              <span className="added-medicine-meta">{m.strength || "-"}</span>
                              <span className="added-medicine-qty">x{m.quantity}</span>
                              <button
                                type="button"
                                className="remove-btn"
                                title="Remove this medicine"
                                onClick={() => removeMedicine(i)}
                              >
                                -
                                </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                              )}

                    
                            </div>
                </div>
              </div>

              {/* Right Column - Customer Information */}
              <div className="right-column">
                <div className="form-section">
                  <label className="form-label" htmlFor="customerName">Customer Name</label>
                  <input
                    id="customerName"
                    className="form-input"
                    type="text"
                    placeholder="Full Name"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    required
                    disabled={!!(customer && customer.name)}
                  />
                </div>
                <div className="form-section">
                  <label className="form-label" htmlFor="city">City</label>
                  <select
                    id="city"
                    className="form-input"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-section">
                  <label className="form-label" htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    className="form-input address-textarea"
                    placeholder="Delivery Address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-section">
                  <label className="form-label" htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    className="form-input"
                    type="tel"
                    placeholder="03XXXXXXXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    pattern="03[0-9]{9}"
                    required
                  />
                </div>
              </div>
            </div>

            {submitErrors.length > 0 && (
              <div className="submit-error">
                <ul>
                  {submitErrors.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="submit-btn"
              type="button"
              onClick={() => {
                const errors = getSubmitErrors();
                if (errors.length > 0) {
                  setSubmitErrors(errors);
                  return;
                }
                setSubmitErrors([]);
                const orderState = { medicines, address, phone, city, customerName };
                if (!customer) {
                  navigate("/customer-auth", {
                    state: { redirectTo: "/select-pharmacy", pendingOrder: orderState }
                  });
                  return;
                }
                navigate("/select-pharmacy", { state: orderState });
              }}
            >
              Select Pharmacy
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyMedicine; 