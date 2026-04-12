import type { Announcement } from '@/lib/types/announcements'

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Actualización de la Política de Teletrabajo',
    content: `<p>Estimados compañeros,</p>
<p>Con motivo de los cambios en la normativa laboral vigente, hemos actualizado nuestra <strong>Política de Teletrabajo</strong> con las siguientes novedades principales:</p>
<ul>
<li>Se amplía a <strong>3 días de teletrabajo</strong> por semana para todos los puestos que lo permitan.</li>
<li>La compensación de gastos de equipamiento aumenta a <strong>50€ mensuales</strong>.</li>
<li>Nuevos formularios de solicitud disponibles en el portal del empleado.</li>
</ul>
<p>La nueva política entra en vigor el próximo <strong>1 de mayo de 2026</strong>. Podéis consultar el documento completo en la sección de Documentos > Políticas de empresa.</p>
<p>Para cualquier duda, contactad con el departamento de RRHH.</p>`,
    author_id: 'emp-2',
    author_name: 'Laura Sánchez López',
    status: 'published',
    target_employees: 'all',
    published_at: '2026-04-10T09:00:00Z',
    views_count: 42,
    created_at: '2026-04-09T16:00:00Z',
  },
  {
    id: 'ann-2',
    title: 'All Hands Meeting — Viernes 18 de Abril',
    content: `<p>¡Hola a todos!</p>
<p>Os recordamos que este <strong>viernes 18 de abril</strong> celebramos nuestro <strong>All Hands Meeting</strong> trimestral.</p>
<p><strong>Detalles del evento:</strong></p>
<ul>
<li>Hora: 9:00 – 11:00</li>
<li>Lugar: Sala Gaudí (Oficina Central Madrid) + streaming para oficinas de Barcelona y Sevilla</li>
<li>Agenda: Resultados Q1, objetivos Q2, novedades de producto y preguntas</li>
</ul>
<p>La asistencia es <strong>obligatoria</strong>. Si trabajáis en remoto ese día, conectaos a través del enlace que recibiréis por email.</p>`,
    author_id: 'emp-2',
    author_name: 'Laura Sánchez López',
    status: 'published',
    target_employees: 'all',
    published_at: '2026-04-11T10:00:00Z',
    views_count: 38,
    created_at: '2026-04-11T10:00:00Z',
  },
  {
    id: 'ann-3',
    title: 'Bienvenida a Elena Castillo Navarro — Equipo de Ventas Sevilla',
    content: `<p>Nos complace anunciar la incorporación de <strong>Elena Castillo Navarro</strong> como Comercial en nuestra Oficina de Sevilla.</p>
<p>Elena se une al equipo de Ventas liderado por Ana González y aportará su experiencia de más de 3 años en el sector tecnológico.</p>
<p>¡Damos la más cálida bienvenida a Elena y le deseamos mucho éxito en esta nueva etapa!</p>`,
    author_id: 'emp-2',
    author_name: 'Laura Sánchez López',
    status: 'published',
    target_employees: 'all',
    published_at: '2026-04-07T09:00:00Z',
    views_count: 29,
    created_at: '2026-04-07T09:00:00Z',
  },
  {
    id: 'ann-4',
    title: 'Resultados Encuesta Clima Laboral 2026',
    content: `<p>Ya tenemos los resultados de la encuesta de clima laboral que realizasteis en marzo. ¡Gracias a todos por vuestra participación!</p>
<p><strong>Puntos destacados:</strong></p>
<ul>
<li>Satisfacción general: <strong>8,2 / 10</strong> (+0,4 respecto al año anterior)</li>
<li>Los aspectos mejor valorados: trabajo en equipo, flexibilidad horaria y formación</li>
<li>Áreas de mejora identificadas: comunicación interdepartamental y espacios de trabajo</li>
</ul>
<p>En las próximas semanas compartiremos el plan de acción concreto para abordar las áreas de mejora. El informe completo está disponible en el portal.</p>`,
    author_id: 'emp-2',
    author_name: 'Laura Sánchez López',
    status: 'published',
    target_employees: 'all',
    published_at: '2026-04-03T10:00:00Z',
    views_count: 51,
    created_at: '2026-04-02T15:00:00Z',
  },
  {
    id: 'ann-5',
    title: 'Nuevo beneficio: Seguro Médico Familiar 2026',
    content: `<p>A partir del próximo mes, todos los empleados con más de 1 año de antigüedad podrán beneficiarse de la extensión del <strong>seguro médico al núcleo familiar</strong>.</p>
<p>La cobertura incluye cónyuge/pareja de hecho e hijos menores de 25 años. El coste para el empleado es de <strong>30€/mes</strong> por beneficiario adicional.</p>
<p>Para solicitar la adhesión, acceded al portal y completad el formulario antes del <strong>30 de abril</strong>.</p>`,
    author_id: 'emp-2',
    author_name: 'Laura Sánchez López',
    status: 'published',
    target_employees: 'all',
    published_at: '2026-03-25T09:00:00Z',
    views_count: 67,
    created_at: '2026-03-24T14:00:00Z',
  },
  {
    id: 'ann-6',
    title: 'Plan de Verano 2026 — Jornada Intensiva',
    content: `<p>Como cada año, durante los meses de <strong>julio y agosto</strong> aplicaremos la jornada intensiva de verano.</p>
<p>El horario será de <strong>8:00 a 15:00</strong> de lunes a viernes. Los viernes de junio también se podrán disfrutar de salida a las 14:00.</p>
<p>Las solicitudes de vacaciones de verano podrán presentarse a partir del 1 de mayo a través del portal. Se atenderán por orden de llegada respetando las necesidades del servicio.</p>`,
    author_id: 'emp-2',
    author_name: 'Laura Sánchez López',
    status: 'scheduled',
    target_employees: 'all',
    scheduled_at: '2026-04-28T09:00:00Z',
    views_count: 0,
    created_at: '2026-04-11T12:00:00Z',
  },
  {
    id: 'ann-7',
    title: 'Comunicado interno: Reestructuración departamento de TI',
    content: `<p>Equipo de Tecnología,</p>
<p>Queremos comunicaros que, para mejorar nuestra capacidad de respuesta e innovación, el departamento de Tecnología se reorganizará en tres squads especializados: <strong>Producto, Infraestructura y Datos</strong>.</p>
<p>Los cambios serán efectivos a partir del 1 de mayo. En los próximos días recibiréis comunicación individual sobre vuestro nuevo equipo y responsabilidades.</p>`,
    author_id: 'emp-1',
    author_name: 'Carlos Martínez García',
    status: 'draft',
    target_departments: ['dept-1'],
    target_employees: ['emp-6', 'emp-9'],
    views_count: 0,
    created_at: '2026-04-11T16:00:00Z',
  },
  {
    id: 'ann-8',
    title: 'Actualización sistema de fichajes — Mantenimiento 13 Abril',
    content: `<p>Os informamos que el próximo <strong>domingo 13 de abril</strong> se realizará un mantenimiento del sistema de fichajes entre las 2:00 y las 6:00 AM.</p>
<p>Durante ese periodo, el sistema no estará disponible. Si necesitáis registrar algún fichaje en ese horario, podéis hacerlo de forma manual al día siguiente indicando el motivo.</p>
<p>Pedimos disculpas por las molestias.</p>`,
    author_id: 'emp-1',
    author_name: 'Carlos Martínez García',
    status: 'archived',
    target_employees: 'all',
    published_at: '2026-04-10T08:00:00Z',
    views_count: 35,
    created_at: '2026-04-09T17:00:00Z',
  },
]

export function getPublishedAnnouncements(): Announcement[] {
  return MOCK_ANNOUNCEMENTS.filter((a) => a.status === 'published').sort(
    (a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime()
  )
}
