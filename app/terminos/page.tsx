import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Términos y Condiciones | K-Beauty Colombia',
  description: 'Lee los términos y condiciones de uso del sitio web y servicio de K-Beauty Colombia.',
};

export default function TerminosPage() {
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
              Términos y Condiciones
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
                  Bienvenido a <strong className="text-primary">K-Beauty Colombia</strong>. Al
                  acceder y utilizar este sitio web, aceptas cumplir los presentes Términos y
                  Condiciones. Si no estás de acuerdo, te pedimos que no uses nuestros servicios.
                </p>
              </div>

              <Section number="1" title="Sobre la empresa">
                <p>
                  K-Beauty Colombia es una tienda en línea dedicada a la venta de productos de
                  cosmética coreana auténticos en Colombia. Operamos bajo la legislación colombiana
                  y cumplimos con las normas del Código de Comercio, el Estatuto del Consumidor
                  (Ley 1480 de 2011) y demás normativas aplicables.
                </p>
              </Section>

              <Section number="2" title="Uso del sitio web">
                <p>Al utilizar este sitio te comprometes a:</p>
                <ul className="mt-3 space-y-2 list-none">
                  <Li>Ser mayor de 18 años o actuar bajo supervisión de un adulto responsable.</Li>
                  <Li>Proporcionar información veraz, completa y actualizada al registrarte o realizar un pedido.</Li>
                  <Li>No usar el sitio para actividades ilícitas, fraudulentas o que violen derechos de terceros.</Li>
                  <Li>No reproducir, distribuir ni explotar comercialmente el contenido del sitio sin autorización escrita.</Li>
                  <Li>Mantener la confidencialidad de tu contraseña y notificarnos de inmediato ante un acceso no autorizado.</Li>
                </ul>
              </Section>

              <Section number="3" title="Productos y precios">
                <p>
                  Todos los productos ofrecidos son importados directamente de Corea del Sur y son
                  100% originales. Los precios se expresan en pesos colombianos (COP) e incluyen
                  IVA cuando aplica.
                </p>
                <p className="mt-3">
                  Nos reservamos el derecho de modificar precios, disponibilidad y descripción de
                  productos sin previo aviso. En caso de error tipográfico en el precio, nos
                  comunicaremos contigo antes de procesar el pedido.
                </p>
              </Section>

              <Section number="4" title="Proceso de compra y pago">
                <p>
                  Para realizar una compra debes seleccionar los productos, completar el formulario
                  de envío y elegir un método de pago. Aceptamos:
                </p>
                <ul className="mt-3 space-y-2 list-none">
                  <Li>Tarjetas de crédito y débito (Visa, Mastercard, Amex) vía Stripe.</Li>
                  <Li>PSE y otros métodos locales vía Wompi.</Li>
                </ul>
                <p className="mt-3">
                  El pedido se confirma una vez verificado el pago. Recibirás un correo de
                  confirmación con el número de orden. Nos reservamos el derecho de cancelar pedidos
                  en caso de fraude, error de precio o falta de stock.
                </p>
              </Section>

              <Section number="5" title="Envíos y tiempos de entrega">
                <p>
                  Realizamos envíos a todo el territorio colombiano. Los tiempos estimados son:
                </p>
                <ul className="mt-3 space-y-2 list-none">
                  <Li><strong className="text-primary">Bogotá, Medellín, Cali:</strong> 1–3 días hábiles.</Li>
                  <Li><strong className="text-primary">Otras ciudades principales:</strong> 3–5 días hábiles.</Li>
                  <Li><strong className="text-primary">Municipios y zonas rurales:</strong> 5–8 días hábiles.</Li>
                </ul>
                <p className="mt-3">
                  Los tiempos son estimados y pueden variar por causas ajenas a nuestro control
                  (festivos, condiciones climáticas, huelgas). El costo de envío se calcula en el
                  checkout; el envío es gratuito en compras superiores a $150.000 COP.
                </p>
              </Section>

              <Section number="6" title="Devoluciones y garantías">
                <p>
                  De acuerdo con el artículo 47 de la Ley 1480 de 2011 (Estatuto del Consumidor),
                  tienes derecho a retractarte de la compra dentro de los{' '}
                  <strong className="text-primary">5 días hábiles</strong> siguientes a la
                  recepción del producto, siempre que:
                </p>
                <ul className="mt-3 space-y-2 list-none">
                  <Li>El producto no haya sido abierto ni usado.</Li>
                  <Li>Conserve su empaque original y todos los accesorios.</Li>
                  <Li>No sea un producto de higiene personal abierto (por razones sanitarias).</Li>
                </ul>
                <p className="mt-3">
                  Para iniciar una devolución escríbenos a{' '}
                  <a href="mailto:soporte@kbeautycolombia.com" className="text-secondary hover:underline font-medium">
                    soporte@kbeautycolombia.com
                  </a>{' '}
                  con tu número de orden. El reembolso se procesa en 5–10 días hábiles.
                </p>
                <p className="mt-3">
                  En caso de producto defectuoso o incorrecto, aceptamos devoluciones sin costo
                  adicional dentro de los <strong className="text-primary">30 días</strong>{' '}
                  posteriores a la entrega.
                </p>
              </Section>

              <Section number="7" title="Propiedad intelectual">
                <p>
                  Todo el contenido del sitio —incluyendo textos, imágenes, logotipos, diseños y
                  código— es propiedad exclusiva de K-Beauty Colombia o de sus licenciantes y está
                  protegido por las leyes colombianas e internacionales de propiedad intelectual.
                  Queda prohibida su reproducción o uso sin autorización escrita previa.
                </p>
              </Section>

              <Section number="8" title="Limitación de responsabilidad">
                <p>
                  K-Beauty Colombia no será responsable por daños indirectos, incidentales o
                  consecuentes derivados del uso del sitio o de los productos. Nuestra
                  responsabilidad máxima se limita al valor pagado por el pedido en cuestión.
                  No garantizamos que el sitio esté libre de errores o interrupciones.
                </p>
              </Section>

              <Section number="9" title="Modificaciones a los términos">
                <p>
                  Podemos actualizar estos Términos en cualquier momento. La versión vigente estará
                  siempre disponible en esta página con la fecha de última actualización. El uso
                  continuado del sitio tras la publicación de cambios implica tu aceptación de los
                  nuevos términos.
                </p>
              </Section>

              <Section number="10" title="Ley aplicable y jurisdicción">
                <p>
                  Estos Términos se rigen por las leyes de la República de Colombia. Para cualquier
                  controversia, las partes se someten a la jurisdicción de los jueces y tribunales
                  competentes de la ciudad de Bogotá D.C., renunciando a cualquier otro fuero que
                  pudiera corresponderles.
                </p>
              </Section>

              <Section number="11" title="Contacto">
                <p>
                  Para cualquier consulta sobre estos Términos contáctanos en:
                </p>
                <div className="mt-4 bg-secondary/5 border border-secondary/20 rounded-xl p-5 space-y-1">
                  <p><strong className="text-primary">K-Beauty Colombia</strong></p>
                  <p>Bogotá, Colombia</p>
                  <p>
                    Email:{' '}
                    <a href="mailto:soporte@kbeautycolombia.com" className="text-secondary hover:underline">
                      soporte@kbeautycolombia.com
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
