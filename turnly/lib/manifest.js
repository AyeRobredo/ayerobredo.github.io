(function () {
  "use strict";
  window.__BRAND__ = {
    name: "Turnly",
    year: new Date().getFullYear(),

    projects: [
      {
        n: "01",
        title: "Agenda en tiempo real",
        desc: "Cada turno reservado se sincroniza al instante entre todos los que atienden el negocio. Nadie pisa el horario de nadie."
      },
      {
        n: "02",
        title: "Recordatorios automaticos",
        desc: "WhatsApp y email 24hs antes. Menos ausencias, menos horarios vacios sin previo aviso."
      },
      {
        n: "03",
        title: "Pagina de reserva propia",
        desc: "Un link unico para que cada cliente reserve solo, sin llamar ni escribir para pedir un horario."
      },
      {
        n: "04",
        title: "Panel simple",
        desc: "Ver el dia, mover un turno, bloquear un horario. Sin curva de aprendizaje, pensado para usarse desde el celular."
      }
    ],

    stats: [
      { value: 40, suffix: "%", label: "menos ausencias reportadas en pruebas piloto" },
      { value: 3, suffix: " min", label: "para configurar la agenda por primera vez" },
      { value: 24, suffix: "/7", label: "reservas sin depender de que alguien atienda el telefono" }
    ],

    pricing: [
      { name: "Solo", price: "Gratis", desc: "Para un profesional independiente.", features: ["1 agenda", "Recordatorios por email", "Pagina de reserva"] },
      { name: "Equipo", price: "$--/mes", desc: "Para negocios con varias personas atendiendo.", features: ["Agendas ilimitadas", "WhatsApp + email", "Reportes basicos"] }
    ],

    contact: { email: "hola@turnly.dev" }
  };
})();
