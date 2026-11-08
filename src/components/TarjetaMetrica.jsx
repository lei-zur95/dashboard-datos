/**
 * @param {Object} props
 * @param {string} props.titulo
 * @param {string|number} props.valor 
 * @param {string} [props.subtitulo] 
 * @param {string} [props.icono] 
 * @param {string} [props.color] 
 */
export default function TarjetaMetrica({ 
  titulo, 
  valor, 
  subtitulo = '', 
  icono = '📊', 
  color = '#38bdf8' 
}) {
  return (
    <div 
      className="tarjeta-metrica"
      style={{
        borderTop: `4px solid ${color}`
      }}
    >
      <div className="tarjeta-metrica-header">
        <span className="tarjeta-metrica-titulo">{titulo}</span>
        <span className="tarjeta-metrica-icono" role="img" aria-label={titulo}>
          {icono}
        </span>
      </div>

      <div className="tarjeta-metrica-valor">
        {valor !== undefined && valor !== null ? valor : '—'}
      </div>

      {subtitulo && (
        <div className="tarjeta-metrica-subtitulo">
          {subtitulo}
        </div>
      )}
    </div>
  );
}
