"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAllSpecialties, useProvinces, useMunicipalities, useSectors, useClients } from "@/hooks/use-queries";
import { Card, CardContent, Label, Textarea } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createService } from "@/services/services";

export default function AdminNewServicePage() {
  const router = useRouter();
  const { data: specialtiesData } = useAllSpecialties();
  const { data: provincesData } = useProvinces();
  const { data: municipalitiesData } = useMunicipalities();
  const { data: sectorsData } = useSectors();
  const { data: clientsData } = useClients();

  const specialties = specialtiesData?.data ?? [];
  const provinces = provincesData?.data ?? [];
  const municipalities = municipalitiesData?.data ?? [];
  const sectors = sectorsData?.data ?? [];
  const clients = clientsData?.data ?? [];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState("instalacion");
  const [clientId, setClientId] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [municipalityId, setMunicipalityId] = useState("");
  const [sectorId, setSectorId] = useState("");
  const [address, setAddress] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [priority, setPriority] = useState("normal");
  const [assignmentMode, setAssignmentMode] = useState("direct_acceptance");
  const [requiredRole, setRequiredRole] = useState("technician");
  const [paymentOffered, setPaymentOffered] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [visibleInstructions, setVisibleInstructions] = useState("");
  const [internalInstructions, setInternalInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function toggleSpecialty(id: string) {
    setSelectedSpecialties((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handleSubmit() {
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    if (!clientId) {
      setError("Debes seleccionar un cliente.");
      return;
    }
    if (!provinceId || !municipalityId) {
      setError("Debes indicar la provincia y el municipio.");
      return;
    }
    if (selectedSpecialties.length === 0) {
      setError("Debes seleccionar al menos una especialidad.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await createService({

      title,
      description,
      service_type: serviceType,
      client_id: clientId,
      province_id: provinceId,
      municipality_id: municipalityId,
      sector_id: sectorId || null,
      address,
      scheduled_date: scheduledDate || null,
      priority,
      assignment_mode: assignmentMode,
      required_role: requiredRole,
      payment_offered: paymentOffered ? Number(paymentOffered) : null,
      visible_instructions: visibleInstructions,
      internal_instructions: internalInstructions,
      specialty_ids: selectedSpecialties,
      status: "draft",
    });
    setIsSubmitting(false);

    if (error) {
      setError(error.message ?? "No se pudo crear el servicio.");
      return;
    }

    setSuccess("Servicio creado correctamente.");
    setTimeout(() => router.push("/admin/services"), 1200);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo servicio</h1>
        <p className="mt-1 text-sm text-gray-500">Crea un servicio técnico para la red</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" placeholder="Ej: Instalación de cámara de seguridad" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" placeholder="Describe el trabajo a realizar..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Tipo de servicio</Label>
              <select id="serviceType" value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
                <option value="instalacion">Instalación</option>
                <option value="reparacion">Reparación</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="levantamiento">Levantamiento</option>
                <option value="soporte">Soporte</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
                <option value="baja">Baja</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientId">Cliente *</Label>
            <select id="clientId" value={clientId} onChange={(e) => setClientId(e.target.value)} className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
              <option value="">Selecciona un cliente</option>
              {clients.map((c: Record<string, unknown>) => (
                <option key={c.id as string} value={c.id as string}>{c.name as string}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="provinceId">Provincia *</Label>
              <select id="provinceId" value={provinceId} onChange={(e) => setProvinceId(e.target.value)} className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
                <option value="">Selecciona</option>
                {provinces.map((p: Record<string, unknown>) => (
                  <option key={p.id as string} value={p.id as string}>{p.name as string}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="municipalityId">Municipio *</Label>
              <select id="municipalityId" value={municipalityId} onChange={(e) => setMunicipalityId(e.target.value)} className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
                <option value="">Selecciona</option>
                {municipalities.map((m: Record<string, unknown>) => (
                  <option key={m.id as string} value={m.id as string}>{m.name as string}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sectorId">Sector</Label>
              <select id="sectorId" value={sectorId} onChange={(e) => setSectorId(e.target.value)} className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
                <option value="">Selecciona</option>
                {sectors.map((s: Record<string, unknown>) => (
                  <option key={s.id as string} value={s.id as string}>{s.name as string}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" placeholder="Dirección del trabajo" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Fecha programada</Label>
              <Input id="scheduledDate" type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentOffered">Pago ofrecido (RD$)</Label>
              <Input id="paymentOffered" type="number" placeholder="0.00" value={paymentOffered} onChange={(e) => setPaymentOffered(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="assignmentMode">Modalidad de asignación</Label>
              <select id="assignmentMode" value={assignmentMode} onChange={(e) => setAssignmentMode(e.target.value)} className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
                <option value="direct_acceptance">Aceptación directa</option>
                <option value="application">Solicitud</option>
                <option value="private_assignment">Asignación privada</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requiredRole">Rol requerido</Label>
              <select id="requiredRole" value={requiredRole} onChange={(e) => setRequiredRole(e.target.value)} className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
                <option value="technician">Técnico</option>
                <option value="helper">Ayudante</option>
                <option value="both">Técnico o Ayudante</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Especialidades requeridas *</Label>
            <div className="flex flex-wrap gap-2">
              {specialties.map((s: Record<string, unknown>) => (
                <button
                  key={s.id as string}
                  type="button"
                  onClick={() => toggleSpecialty(s.id as string)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    selectedSpecialties.includes(s.id as string)
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
                  }`}
                >
                  {s.name as string}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibleInstructions">Instrucciones visibles para el técnico</Label>
            <Textarea id="visibleInstructions" placeholder="Instrucciones que verá el técnico..." value={visibleInstructions} onChange={(e) => setVisibleInstructions(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="internalInstructions">Instrucciones internas</Label>
            <Textarea id="internalInstructions" placeholder="Instrucciones internas (solo administración)..." value={internalInstructions} onChange={(e) => setInternalInstructions(e.target.value)} />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => router.push("/admin/services")}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear servicio"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
