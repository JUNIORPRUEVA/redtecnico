"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Label,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Checkbox,
  Textarea,
  Select,
  SelectItem,
  Card,
  CardContent,
} from "@/components/ui/primitives";
import { signUp } from "@/services/auth";
import { createWorkerProfile } from "@/services/worker";
import { useProvinces, useMunicipalities, useSectors, useSpecialties } from "@/hooks/use-queries";

const STEPS = [
  "Cuenta",
  "Tipo de colaborador",
  "Información personal",
  "Capacidades",
  "Recursos",
  "Documentos",
  "Revisión",
];

export default function RegisterPage() {
  const [step, setStep] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Paso 1: Cuenta
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Paso 2: Tipo
  const [workerType, setWorkerType] = useState("technician");

  // Paso 3: Información personal
  const [cedula, setCedula] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [municipalityId, setMunicipalityId] = useState("");
  const [sectorId, setSectorId] = useState("");

  // Paso 4: Capacidades
  const [yearsExperience, setYearsExperience] = useState("");
  const [experienceDescription, setExperienceDescription] = useState("");
  const [level, setLevel] = useState("basico");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [availability, setAvailability] = useState("");

  // Paso 5: Recursos
  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicleType, setVehicleType] = useState("");
  const [hasTools, setHasTools] = useState(false);
  const [toolsList, setToolsList] = useState("");
  const [canWorkAsHelper, setCanWorkAsHelper] = useState(false);
  const [canLeadInstallation, setCanLeadInstallation] = useState(false);
  const [canTravelOutside, setCanTravelOutside] = useState(false);

  const { data: provincesData } = useProvinces();
  const { data: municipalitiesData } = useMunicipalities(provinceId || undefined);
  const { data: sectorsData } = useSectors(municipalityId || undefined);
  const { data: specialtiesData } = useSpecialties();

  const provinces = provincesData?.data ?? [];
  const municipalities = municipalitiesData?.data ?? [];
  const sectors = sectorsData?.data ?? [];
  const specialties = specialtiesData?.data ?? [];

  function validateStep(current: number): string | null {
    if (current === 0) {
      if (!firstName.trim()) return "Ingresa tu nombre.";
      if (!lastName.trim()) return "Ingresa tus apellidos.";
      if (!email.trim() || !email.includes("@")) return "Ingresa un correo válido.";
      if (!phone.trim()) return "Ingresa tu teléfono.";
      if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
      if (password !== confirmPassword) return "Las contraseñas no coinciden.";
      if (!acceptTerms) return "Debes aceptar los términos y políticas.";
    }
    if (current === 1) {
      if (!workerType) return "Selecciona tu tipo de colaborador.";
    }
    if (current === 2) {
      if (!cedula.trim()) return "Ingresa tu número de cédula.";
      if (!address.trim()) return "Ingresa tu dirección.";
      if (!provinceId) return "Selecciona tu provincia.";
      if (!municipalityId) return "Selecciona tu municipio.";
      if (!sectorId) return "Selecciona tu sector.";
    }
    if (current === 3) {
      if (selectedSpecialties.length === 0) return "Selecciona al menos una especialidad.";
    }
    return null;
  }

  function handleNext() {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function handleBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function toggleSpecialty(id: string) {
    setSelectedSpecialties((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handleSubmit() {
    setError(null);
    setIsLoading(true);

    try {
      // 1. Crear cuenta
      const { data: authData, error: authError } = await signUp(email, password, `${firstName} ${lastName}`);
      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("No se pudo crear la cuenta.");

      // 2. Crear perfil de colaborador
      const { error: profileError } = await createWorkerProfile({
        user_id: authData.user.id,
        status: "pending_review",
        worker_type: workerType,
        cedula,
        birth_date: birthDate || null,
        address,
        province_id: provinceId || null,
        municipality_id: municipalityId || null,
        sector_id: sectorId || null,
        years_experience: yearsExperience ? parseInt(yearsExperience) : null,
        experience_description: experienceDescription,
        level,
        availability,
        has_vehicle: hasVehicle,
        vehicle_type: vehicleType || null,
        has_tools: hasTools,
        tools_list: toolsList ? toolsList.split(",").map((t) => t.trim()).filter(Boolean) : [],
        can_work_as_helper: canWorkAsHelper,
        can_lead_installation: canLeadInstallation,
        can_travel_outside: canTravelOutside,
      });

      if (profileError) throw new Error(profileError.message);

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al enviar tu solicitud.");
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">¡Solicitud enviada!</h1>
          <p className="mt-3 text-gray-600">
            Gracias por registrarte. FULLTECH revisará tu solicitud y te notificará
            cuando tu perfil sea aprobado. Mientras tanto, puedes consultar el estado
            de tu solicitud.
          </p>
          <Link href="/application-status" className="mt-6 inline-block">
            <Button>Consultar estado de mi solicitud</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Registro de colaborador</h1>
          <p className="mt-1 text-sm text-gray-500">
            Paso {step + 1} de {STEPS.length}: {STEPS[step]}
          </p>
        </div>

        <Progress value={((step + 1) / STEPS.length) * 100} className="mb-6" />

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Card>
          <CardContent className="p-6">
            {/* Paso 1: Cuenta */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Juan" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellidos</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Pérez" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="809-000-0000" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repite la contraseña" />
                  </div>
                </div>
                <label className="flex items-start gap-3 text-sm text-gray-600">
                  <Checkbox checked={acceptTerms} onCheckedChange={setAcceptTerms} aria-label="Aceptar términos" />
                  <span>
                    Acepto los{" "}
                    <Link href="/terms" className="text-blue-700 hover:underline">términos y condiciones</Link>{" "}
                    y la{" "}
                    <Link href="/privacy" className="text-blue-700 hover:underline">política de privacidad</Link>.
                  </span>
                </label>
              </div>
            )}

            {/* Paso 2: Tipo de colaborador */}
            {step === 1 && (
              <div className="space-y-4">
                <RadioGroup value={workerType} onValueChange={setWorkerType}>
                  <RadioGroupItem value="technician">
                    <div>
                      <p className="font-medium text-gray-900">Técnico</p>
                      <p className="text-sm text-gray-500">Realizo instalaciones, reparaciones y mantenimiento.</p>
                    </div>
                  </RadioGroupItem>
                  <RadioGroupItem value="helper">
                    <div>
                      <p className="font-medium text-gray-900">Ayudante</p>
                      <p className="text-sm text-gray-500">Asisto a técnicos en los trabajos.</p>
                    </div>
                  </RadioGroupItem>
                  <RadioGroupItem value="both">
                    <div>
                      <p className="font-medium text-gray-900">Ambos</p>
                      <p className="text-sm text-gray-500">Puedo trabajar como técnico o ayudante.</p>
                    </div>
                  </RadioGroupItem>
                </RadioGroup>
              </div>
            )}

            {/* Paso 3: Información personal */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cedula">Número de cédula</Label>
                  <Input id="cedula" value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="000-0000000-0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de nacimiento (opcional)</Label>
                  <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle, número, sector" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="province">Provincia</Label>
                    <Select value={provinceId} onValueChange={(v) => { setProvinceId(v); setMunicipalityId(""); setSectorId(""); }} placeholder="Selecciona">
                      {provinces.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="municipality">Municipio</Label>
                    <Select value={municipalityId} onValueChange={(v) => { setMunicipalityId(v); setSectorId(""); }} placeholder="Selecciona" disabled={!provinceId}>
                      {municipalities.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector</Label>
                    <Select value={sectorId} onValueChange={setSectorId} placeholder="Selecciona" disabled={!municipalityId}>
                      {sectors.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 4: Capacidades */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="years">Años de experiencia</Label>
                    <Input id="years" type="number" min="0" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Nivel</Label>
                    <Select value={level} onValueChange={setLevel}>
                      <SelectItem value="aprendiz">Aprendiz</SelectItem>
                      <SelectItem value="basico">Básico</SelectItem>
                      <SelectItem value="intermedio">Intermedio</SelectItem>
                      <SelectItem value="avanzado">Avanzado</SelectItem>
                      <SelectItem value="especialista">Especialista</SelectItem>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expDesc">Descripción de experiencia</Label>
                  <Textarea id="expDesc" value={experienceDescription} onChange={(e) => setExperienceDescription(e.target.value)} placeholder="Describe tu experiencia técnica..." />
                </div>
                <div className="space-y-2">
                  <Label>Áreas de trabajo (especialidades)</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {specialties.map((s) => (
                      <label key={s.id} className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm hover:bg-gray-50">
                        <Checkbox checked={selectedSpecialties.includes(s.id)} onCheckedChange={() => toggleSpecialty(s.id)} aria-label={s.name} />
                        <span>{s.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Disponibilidad</Label>
                  <Input id="availability" value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Ej: Lunes a viernes, 8am - 5pm" />
                </div>
              </div>
            )}

            {/* Paso 5: Recursos */}
            {step === 4 && (
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <Checkbox checked={hasVehicle} onCheckedChange={setHasVehicle} aria-label="Tengo vehículo" />
                  Tengo vehículo
                </label>
                {hasVehicle && (
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Tipo de vehículo</Label>
                    <Input id="vehicleType" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder="Ej: Motocicleta, carro" />
                  </div>
                )}
                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <Checkbox checked={hasTools} onCheckedChange={setHasTools} aria-label="Tengo herramientas" />
                  Tengo herramientas
                </label>
                {hasTools && (
                  <div className="space-y-2">
                    <Label htmlFor="toolsList">Lista de herramientas (separadas por coma)</Label>
                    <Textarea id="toolsList" value={toolsList} onChange={(e) => setToolsList(e.target.value)} placeholder="Taladro, multímetro, escalera..." />
                  </div>
                )}
                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <Checkbox checked={canWorkAsHelper} onCheckedChange={setCanWorkAsHelper} aria-label="Puedo trabajar como ayudante" />
                  Puedo trabajar como ayudante
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <Checkbox checked={canLeadInstallation} onCheckedChange={setCanLeadInstallation} aria-label="Puedo dirigir una instalación" />
                  Puedo dirigir una instalación
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <Checkbox checked={canTravelOutside} onCheckedChange={setCanTravelOutside} aria-label="Puedo viajar fuera de mi municipio" />
                  Puedo viajar fuera de mi municipio
                </label>
              </div>
            )}

            {/* Paso 6: Documentos */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                  <p className="font-medium">Documentos requeridos</p>
                  <p className="mt-1">
                    Deberás subir la foto frontal y posterior de tu cédula, y otros
                    documentos según lo requiera FULLTECH. Podrás cargarlos desde tu
                    perfil después de crear tu cuenta.
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Los documentos se almacenan de forma segura y solo son visibles para
                  el equipo administrativo de FULLTECH.
                </p>
              </div>
            )}

            {/* Paso 7: Revisión */}
            {step === 6 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Revisa tu información</h3>
                <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
                  <p><strong>Nombre:</strong> {firstName} {lastName}</p>
                  <p><strong>Correo:</strong> {email}</p>
                  <p><strong>Teléfono:</strong> {phone}</p>
                  <p><strong>Tipo:</strong> {workerType === "technician" ? "Técnico" : workerType === "helper" ? "Ayudante" : "Ambos"}</p>
                  <p><strong>Cédula:</strong> {cedula}</p>
                  <p><strong>Nivel:</strong> {level}</p>
                  <p><strong>Especialidades:</strong> {selectedSpecialties.length}</p>
                </div>
                <p className="text-sm text-gray-600">
                  Al enviar tu solicitud, FULLTECH revisará tu información. Recibirás
                  una notificación cuando tu perfil sea aprobado.
                </p>
              </div>
            )}

            {/* Navegación */}
            <div className="mt-6 flex justify-between gap-3">
              <Button variant="outline" onClick={handleBack} disabled={step === 0}>
                Atrás
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={handleNext}>Continuar</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar solicitud"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-blue-700 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
