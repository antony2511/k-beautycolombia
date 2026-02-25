import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Política de Privacidad | K-Beauty Colombia',
  description: 'Conoce cómo recopilamos, usamos y protegemos tu información personal en K-Beauty Colombia.',
};

export default function PrivacidadPage() {
  const lastUpdated = '25 de febrero de 2026';

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background-gray pt-24">
        {/* Header */}
        <section className="py-14 bg-gradient-to-br from-background-cream/60 via-secondary/5 to-background-cream/60">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="inline-block text-secondary font-bold uppercase tracking-widest text-sm mb-4 bg-secondary/10 px-4 py-2 rounded-full">
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
              Política de Privacidad
            </h1>
            <p className="text-accent">Última actualización: {lastUpdated}</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-14">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-sm border border-accent-light/30 p-8 md:p-12 space-y-10 text-accent leading-relaxed">

              <div>
                <p className="text-lg">
                  En <strong className="text-primary">K-Beauty Colombia</strong> nos comprometemos
                  a proteger tu información personal. Esta política describe cómo recopilamos,
                  usamos y resguardamos los datos que nos proporcionas al utilizar nuestro sitio web
                  y realizar compras.
                </p>
              </div>

              <Section number="1" title="Información que recopilamos">
                <p>Podemos recopilar los siguientes tipos de información:</p>
                <ul className="mt-3 space-y-2 list-none">
                  <Li><strong className="text-primary">Datos de identificación:</strong> nombre completo, correo electrónico, número de teléfono y documento de identidad (cuando aplique para facturación).</Li>
                  <Li><strong className="text-primary">Datos de envío:</strong> dirección de entrega, ciudad, departamento y código postal.</Li>
                  <Li><strong className="text-primary">Datos de pago:</strong> procesados directamente por pasarelas seguras (Stripe / Wompi). No almacenamos números de tarjeta.</Li>
                  <Li><strong className="text-primary">Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas y tiempo de sesión, mediante cookies.</Li>
                  <Li><strong className="text-primary">Historial de compras:</strong> productos adquiridos, fechas y valores de las transacciones.</Li>
                </ul>
              </Section>

              <Section number="2" title="Cómo usamos tu información">
                <p>Utilizamos tus datos para:</p>
                <ul className="mt-3 space-y-2 list-none">
                  <Li>Procesar y entregar tus pedidos.</Li>
                  <Li>Enviar confirmaciones de compra y actualizaciones de envío.</Li>
                  <Li>Personalizar tu experiencia de compra y recomendarte productos.</Li>
                  <Li>Responder consultas y brindar soporte al cliente.</Li>
                  <Li>Enviarte comunicaciones de marketing (solo si has dado tu consentimiento).</Li>
                  <Li>Cumplir con obligaciones legales y fiscales en Colombia.</Li>
                  <Li>Prevenir fraudes y garantizar la seguridad de la plataforma.</Li>
                </ul>
              </Section>

              <Section number="3" title="Base legal del tratamiento">
                <p>
                  El tratamiento de tus datos se fundamenta en la{' '}
                  <strong className="text-primary">Ley 1581 de 2012</strong> (Ley de Protección de
                  Datos Personales de Colombia) y el Decreto 1377 de 2013. Tratamos tus datos bajo
                  las bases legales de: ejecución del contrato de compraventa, cumplimiento de
                  obligaciones legales y tu consentimiento expreso para comunicaciones comerciales.
                </p>
              </Section>

              <Section number="4" title="Compartición de datos con terceros">
                <p>
                  No vendemos ni arrendamos tu información personal. Únicamente la compartimos con:
                </p>
                <ul className="mt-3 space-y-2 list-none">
                  <Li><strong className="text-primary">Operadores logísticos</strong> (ej: Coordinadora, Servientrega) para gestionar la entrega de tus pedidos.</Li>
                  <Li><strong className="text-primary">Pasarelas de pago</strong> (Stripe, Wompi) para procesar transacciones de forma segura.</Li>
                  <Li><strong className="text-primary">Proveedores de tecnología</strong> que nos ayudan a operar el sitio (hosting, email), bajo acuerdos de confidencialidad.</Li>
                  <Li><strong className="text-primary">Autoridades competentes</strong> cuando sea requerido por ley.</Li>
                </ul>
              </Section>

              <Section number="5" title="Cookies y tecnologías de seguimiento">
                <p>
                  Utilizamos cookies propias y de terceros para mejorar la experiencia de navegación,
                  recordar tu carrito y analizar el tráfico del sitio. Puedes desactivar las cookies
                  no esenciales desde la configuración de tu navegador; sin embargo, algunas
                  funcionalidades del sitio podrían verse afectadas.
                </p>
              </Section>

              <Section number="6" title="Retención de datos">
                <p>
                  Conservamos tu información personal durante el tiempo necesario para cumplir los
                  fines descritos en esta política y según los plazos exigidos por la legislación
                  colombiana (generalmente 5 años para registros contables y comerciales).
                  Transcurrido ese plazo, los datos son eliminados o anonimizados de forma segura.
                </p>
              </Section>

              <Section number="7" title="Tus derechos">
                <p>
                  De acuerdo con la Ley 1581 de 2012, tienes derecho a:
                </p>
                <ul className="mt-3 space-y-2 list-none">
                  <Li><strong className="text-primary">Conocer</strong> qué datos personales tuyos tratamos.</Li>
                  <Li><strong className="text-primary">Actualizar o corregir</strong> información inexacta.</Li>
                  <Li><strong className="text-primary">Solicitar la supresión</strong> de tus datos cuando no exista obligación legal de conservarlos.</Li>
                  <Li><strong className="text-primary">Revocar el consentimiento</strong> para el envío de comunicaciones comerciales.</Li>
                  <Li><strong className="text-primary">Presentar quejas</strong> ante la Superintendencia de Industria y Comercio (SIC).</Li>
                </ul>
                <p className="mt-3">
                  Para ejercer cualquiera de estos derechos escríbenos a{' '}
                  <a href="mailto:privacidad@kbeautycolombia.com" className="text-secondary hover:underline font-medium">
                    privacidad@kbeautycolombia.com
                  </a>.
                </p>
              </Section>

              <Section number="8" title="Seguridad">
                <p>
                  Implementamos medidas técnicas y organizativas para proteger tus datos contra
                  accesos no autorizados, pérdida o alteración: cifrado SSL/TLS en todas las
                  comunicaciones, acceso restringido a la base de datos y revisiones periódicas de
                  seguridad. Sin embargo, ninguna transmisión por Internet es 100% segura, por lo
                  que te recomendamos mantener tu contraseña confidencial.
                </p>
              </Section>

              <Section number="9" title="Cambios a esta política">
                <p>
                  Podemos actualizar esta política periódicamente. Cuando lo hagamos, modificaremos
                  la fecha de "última actualización" al inicio de este documento. Para cambios
                  significativos, te notificaremos por correo electrónico o mediante un aviso
                  destacado en el sitio.
                </p>
              </Section>

              <Section number="10" title="Contacto">
                <p>
                  Si tienes preguntas sobre esta política o el tratamiento de tus datos, puedes
                  contactarnos en:
                </p>
                <div className="mt-4 bg-secondary/5 border border-secondary/20 rounded-xl p-5 space-y-1">
                  <p><strong className="text-primary">K-Beauty Colombia</strong></p>
                  <p>Bogotá, Colombia</p>
                  <p>
                    Email:{' '}
                    <a href="mailto:privacidad@kbeautycolombia.com" className="text-secondary hover:underline">
                      privacidad@kbeautycolombia.com
                    </a>
                  </p>
                </div>
              </Section>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-3">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/10 text-secondary text-sm font-bold flex items-center justify-center">
          {number}
        </span>
        {title}
      </h2>
      <div className="pl-11">{children}</div>
    </div>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-secondary"></span>
      <span>{children}</span>
    </li>
  );
}
