import {
  BookOpen,
  Target,
  Lightbulb,
  Users,
  TrendingUp,
  CheckCircle2,
  Package,
  Receipt,
  Shield,
  Sparkles,
  Rocket,
  User,
  Code2,
  ExternalLink,
  AlertTriangle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../../../../components/common/data-display/Card';
import { Badge } from '../../../../components/common/data-display/Badge';
import styles from './Docs.module.css';

export default function Docs() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleBlock}>
            <div className={styles.titleRow}>
              <BookOpen size={26} />
              <h1 className={styles.title}>Sobre el Proyecto</h1>
            </div>
            <p className={styles.subtitle}>
              InvenSaaS: plataforma para digitalizar el inventario y la facturacion
              de las PYMES venezolanas
            </p>
          </div>
          <Badge variant="primary" size="md">Proyecto UNA 2026-2</Badge>
        </div>
      </header>

      <div className={styles.content}>
        {/* ============ CREATOR ============ */}
        <Card padding="md">
          <div className={styles.creatorCard}>
            <div className={styles.avatar}>
              <User size={28} />
            </div>
            <div className={styles.creatorInfo}>
              <h2 className={styles.creatorName}>Axel Gabriel Jimenez Malaver</h2>
              <p className={styles.creatorMeta}>
                C.I. 27.870.662 · Ingenieria de Sistemas · Universidad Nacional Abierta
              </p>
              <p className={styles.creatorMeta}>
                Evaluacion de Proyectos (225) · Lapso 2026-2
              </p>
            </div>
            <a
              href="https://github.com/axeljimenezdeveloper/mi-saas-frontend"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.repoLink}
            >
              <Code2 size={14} />
              <span>Ver repositorio</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </Card>

        {/* ============ WHAT IS IT ============ */}
        <section className={styles.section}>
          <SectionTitle icon={<BookOpen size={20} />} title="Que es InvenSaaS" />
          <Card padding="md">
            <p className={styles.paragraph}>
              InvenSaaS es una plataforma en la nube (Software as a Service) disenada
              para que las pequenas y medianas empresas venezolanas puedan gestionar
              su <strong>inventario</strong> y su <strong>facturacion</strong> desde
              cualquier dispositivo con internet, sin necesidad de instalar programas
              ni comprar servidores.
            </p>
            <p className={styles.paragraph}>
              Funciona como una suscripcion mensual: la empresa paga una cuota
              accesible y accede al sistema desde el navegador. Todos los datos se
              guardan de forma segura en la nube, y las actualizaciones del software
              son automaticas.
            </p>
            <div className={styles.highlightBox}>
              <Lightbulb size={18} />
              <p>
                <strong>En palabras simples:</strong> es como tener un "cuaderno
                digital inteligente" que sabe cuanto vendiste, cuanto te queda en
                stock, y genera facturas legales automaticamente.
              </p>
            </div>
          </Card>
        </section>

        {/* ============ PROBLEM ============ */}
        <section className={styles.section}>
          <SectionTitle icon={<AlertTriangle size={20} />} title="Que problema resuelve" />
          <Card padding="md">
            <p className={styles.paragraph}>
              Hoy en dia, la mayoria de las PYMES venezolanas gestionan su inventario
              y sus ventas de forma manual: con cuadernos, hojas de calculo de Excel,
              o simplemente de memoria. Esto genera problemas graves:
            </p>
            <ul className={styles.problemList}>
              <li>
                <span className={styles.problemDot} />
                <div>
                  <strong>Perdida de mercancia:</strong> sin un registro claro, es
                  imposible saber que productos se agotan o se pierden.
                </div>
              </li>
              <li>
                <span className={styles.problemDot} />
                <div>
                  <strong>Errores en las facturas:</strong> calcular precios e IVA a
                  mano genera errores que cuestan dinero y problemas con el SENIAT.
                </div>
              </li>
              <li>
                <span className={styles.problemDot} />
                <div>
                  <strong>Falta de informacion:</strong> sin datos en tiempo real, el
                  dueno no sabe cuanto gano, cuanto vendio, ni que productos son mas
                  rentables.
                </div>
              </li>
              <li>
                <span className={styles.problemDot} />
                <div>
                  <strong>Competencia desigual:</strong> las grandes cadenas usan
                  tecnologia avanzada. Las PYMES no pueden competir con los mismos
                  recursos.
                </div>
              </li>
            </ul>
            <div className={styles.highlightBox}>
              <Target size={18} />
              <p>
                <strong>Nuestra mision:</strong> darle a las PYMES las mismas
                herramientas digitales que tienen las grandes empresas, pero a un
                precio accesible y sin complicaciones tecnicas.
              </p>
            </div>
          </Card>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section className={styles.section}>
          <SectionTitle icon={<Layers size={20} />} title="Como funciona" />
          <div className={styles.flowGrid}>
            <FlowStep
              number={1}
              title="Registra tu empresa"
              description="Ingresas los datos de tu negocio: nombre, RIF y direccion. Todo en menos de 2 minutos."
            />
            <FlowStep
              number={2}
              title="Carga tus productos"
              description="Agregas los productos que vendes con su precio, stock inicial y hasta fotos."
            />
            <FlowStep
              number={3}
              title="Empieza a facturar"
              description="Seleccionas los productos, el sistema calcula el IVA automaticamente y descuenta el stock."
            />
            <FlowStep
              number={4}
              title="Controla tu negocio"
              description="Ves en un panel cuanto vendiste, que productos estan bajos de stock, y tus facturas pendientes."
            />
          </div>
        </section>

        {/* ============ BENEFITS ============ */}
        <section className={styles.section}>
          <SectionTitle icon={<Sparkles size={20} />} title="Beneficios para tu negocio" />
          <div className={styles.benefitsGrid}>
            <BenefitCard
              icon={<TrendingUp size={22} />}
              title="Control total del inventario"
              description="Sabes exactamente cuantos productos tienes, cuales estan por agotarse y cuales no se venden."
            />
            <BenefitCard
              icon={<Receipt size={22} />}
              title="Facturas sin errores"
              description="El sistema calcula precios, IVA y totales automaticamente. Cumples con el SENIAT sin esfuerzo."
            />
            <BenefitCard
              icon={<Package size={22} />}
              title="Descuento automatico de stock"
              description="Cada vez que facturas, el inventario se actualiza solo. Adios a los cuadernos desactualizados."
            />
            <BenefitCard
              icon={<TrendingUp size={22} />}
              title="Decisiones con datos"
              description="Ves que productos son mas rentables, cuanto vendiste en la semana, y cuanto dinero tienes cobrado."
            />
            <BenefitCard
              icon={<Shield size={22} />}
              title="Datos seguros en la nube"
              description="Toda la informacion se guarda cifrada. No hay riesgo de perderla si se danara tu computadora."
            />
            <BenefitCard
              icon={<Users size={22} />}
              title="Accesible desde cualquier lugar"
              description="Funciona en computadora, tablet y celular. Puedes revisar tu negocio desde donde estes."
            />
          </div>
        </section>

        {/* ============ FEATURES IN BUSINESS TERMS ============ */}
        <section className={styles.section}>
          <SectionTitle icon={<CheckCircle2 size={20} />} title="Que puedes hacer con InvenSaaS" />
          <div className={styles.featuresGrid}>
            <FeatureCard
              title="Inventario"
              items={[
                'Registrar productos con foto, precio y stock',
                'Editar o eliminar productos cuando lo necesites',
                'Ver alertas cuando un producto esta por agotarse',
                'Buscar por nombre, categoria o codigo',
              ]}
            />
            <FeatureCard
              title="Facturacion"
              items={[
                'Crear facturas en segundos',
                'Calcular IVA (16%) automaticamente',
                'Descontar stock al vender',
                'Marcar facturas como pagadas o pendientes',
              ]}
            />
            <FeatureCard
              title="Panel de control"
              items={[
                'Ver ventas de la semana en un grafico',
                'Conocer tus productos mas vendidos',
                'Revisar cuanto dinero tienes cobrado',
                'Alertas de stock bajo en tiempo real',
              ]}
            />
            <FeatureCard
              title="Configuracion"
              items={[
                'Personalizar los datos de tu empresa',
                'Elegir la moneda (bolivares o dolares)',
                'Configurar el IVA por defecto',
                'Cambiar entre modo claro y oscuro',
              ]}
            />
          </div>
        </section>

        {/* ============ DEMO GUIDE ============ */}
        <section className={styles.section}>
          <SectionTitle icon={<Sparkles size={20} />} title="Como probar el sistema" />
          <Card padding="md">
            <p className={styles.paragraph}>
              El sistema viene con datos de ejemplo ya cargados para que puedas
              explorar todas las funcionalidades sin tener que crear todo desde cero.
            </p>
            <ol className={styles.demoSteps}>
              <li>
                <span className={styles.stepNumber}>1</span>
                <div>
                  <strong>Inicia sesion</strong>
                  <p>En la pantalla de login, haz click en "Probar con datos de ejemplo" para acceder directamente.</p>
                </div>
              </li>
              <li>
                <span className={styles.stepNumber}>2</span>
                <div>
                  <strong>Explora el panel principal</strong>
                  <p>Veras cuantos productos tienes, cuantas facturas y un grafico con tus ventas de la semana.</p>
                </div>
              </li>
              <li>
                <span className={styles.stepNumber}>3</span>
                <div>
                  <strong>Revisa el inventario</strong>
                  <p>En "Inventario" puedes ver todos los productos, editarlos o crear nuevos.</p>
                </div>
              </li>
              <li>
                <span className={styles.stepNumber}>4</span>
                <div>
                  <strong>Crea una factura</strong>
                  <p>En "Facturacion" puedes crear una factura nueva. Mira como el stock se descuenta automaticamente.</p>
                </div>
              </li>
              <li>
                <span className={styles.stepNumber}>5</span>
                <div>
                  <strong>Prueba cambiar el tema</strong>
                  <p>Con el boton de sol/luna en la esquina superior, cambia entre modo claro y oscuro.</p>
                </div>
              </li>
            </ol>
          </Card>
        </section>

        {/* ============ VISION ============ */}
        <section className={styles.section}>
          <SectionTitle icon={<Rocket size={20} />} title="Hacia donde va el proyecto" />
          <Card padding="md">
            <p className={styles.paragraph}>
              Esta version es el <strong>Producto Minimo Viable (MVP)</strong>: tiene
              las funcionalidades esenciales para que una PYME pueda empezar a operar
              digitalmente. Los siguientes pasos incluyen:
            </p>
            <div className={styles.roadmapGrid}>
              <VisionItem
                title="Backend en la nube"
                description="Guardar los datos en servidores reales para que persistan entre sesiones y dispositivos."
              />
              <VisionItem
                title="Notificaciones inteligentes"
                description="Avisos automaticos cuando un producto se agota, cuando vence una factura, o cuando hay una venta importante."
              />
              <VisionItem
                title="Facturas en PDF"
                description="Generar facturas descargables con formato compatible con los requisitos del SENIAT."
              />
              <VisionItem
                title="Reportes avanzados"
                description="Estadisticas por periodo: ventas del mes, productos top, margenes de ganancia."
              />
            </div>
          </Card>
        </section>

        {/* ============ FOOTER ============ */}
        <footer className={styles.footer}>
          <Shield size={14} />
          <p>
            Proyecto academico desarrollado por <strong>Axel Gabriel Jimenez Malaver</strong> · UNA 2026-2
          </p>
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className={styles.sectionTitle}>
      <span className={styles.sectionIcon}>{icon}</span>
      <h2 className={styles.sectionTitleText}>{title}</h2>
    </div>
  );
}

function FlowStep({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <Card padding="md">
      <div className={styles.flowStep}>
        <div className={styles.flowNumber}>{number}</div>
        <div>
          <h4 className={styles.flowTitle}>{title}</h4>
          <p className={styles.flowDescription}>{description}</p>
        </div>
      </div>
    </Card>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card padding="md">
      <div className={styles.benefitIcon}>{icon}</div>
      <h4 className={styles.benefitTitle}>{title}</h4>
      <p className={styles.benefitDescription}>{description}</p>
    </Card>
  );
}

function FeatureCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card padding="md">
      <h3 className={styles.featureTitle}>{title}</h3>
      <ul className={styles.featureList}>
        {items.map((item) => (
          <li key={item}>
            <CheckCircle2 size={14} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function VisionItem({ title, description }: { title: string; description: string }) {
  return (
    <div className={styles.visionItem}>
      <div className={styles.visionHeader}>
        <ArrowRight size={14} />
        <h4 className={styles.visionTitle}>{title}</h4>
      </div>
      <p className={styles.visionDescription}>{description}</p>
    </div>
  );
}
