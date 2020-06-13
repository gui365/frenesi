import React, { Component } from 'react';
import Navbar from '../../components/Navbar';
import './Help.scss';

class Help extends Component {

  render() {
    return (
      <div id='container' >
        <Navbar optionBack={true} />
        <h1 className='page-title'>Reglas</h1>
        <main id='dashboard-content'>
          <section id='rules-section'>
            <ol>
              <li><h2 className='page-subtitle'>Reglas básicas</h2>
                <ol className='p-05rem'>
                  <li>
                    <h3 className='page-subtitle-section'>Objetivo</h3>
                    <p className='rules-text'>El objetivo del juego es ganar la mayor cantidad de rondas hasta que se terminen las cartas de preguntas del mazo.</p>
                  </li>
                  <li>
                    <h3 className='page-subtitle-section'>Comienzo de juego</h3>
                    <p className='rules-text'>Cada jugador recibe 7 cartas de respuestas. El juez lee la pregunta en voz alta. El resto de los jugadores juegan la carta que crean es más adecuada a la pregunta. Cuando todos los jugadores hayan jugado una carta, el juez lee en voz alta cada una de las combinaciones (pregunta-respuesta). Luego elije la carta ganadora y el jugador que la jugó suma un punto.</p>
                  </li>
                  <li className='rules-text'>
                    <h3 className='page-subtitle-section'>Siguientes rondas</h3>
                    <p className='rules-text'>Al finalizar la ronda, todos los jugadores reciben la cantidad de cartas que se hayan jugado en la ronda anterior. Todos los jugadores deben tener 7 cartas al iniciar una nueva ronda.</p>
                    <p className='rules-text m-t-03rem'>El nuevo juez será la siguiente persona en la lista de jugadores (parte superior de la pantalla).</p>
                  </li>
                </ol>
              </li>

              <li><h2 className='page-subtitle'>Cartas</h2>
                <ol className='p-05rem'>
                  <li>
                    <h3 className='page-subtitle-section'>Respuestas</h3>
                    <p className='rules-text'>Estas cartas son de color blanco y pueden incluir 3 categorías: objetos, personas/personajes, o acciones. Algunas cartas pueden ser utilizadas para más de una categoría.</p>
                  </li>
                  <li>
                    <h3 className='page-subtitle-section'>Preguntas</h3>
                    <p className='rules-text'>Estas cartas son de color violeta e incluyen frases que pueden ser completadas usando cartas de respuestas. Algunas cartas de preguntas requieren más de una carta de respuesta. En este caso, las cartas deben ser jugadas en el mismo orden en el que deban ser leídas.</p>
                  </li>
                </ol>
              </li>

              <li><h2 className='page-subtitle'>Opcional: Dado</h2>
                <ol className='p-05rem'>
                  <li>
                    <h3 className='page-subtitle-section'>Cuándo se tira el dado</h3>
                    <p className='rules-text'>Si se decide jugar de este modo, el juez tira el dado si la carta de pregunta tiene un símbolo de dado. La acción afecta al jugador que sería el juez en la siguiente ronda.</p>
                  </li>
                  <li>
                    <h3 className='page-subtitle-section'>Caras del dado</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>Símbolo</th>
                          <th>Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <img className='dice-side' src='images/dado-lado4.jpg' alt='icon' />
                          </td>
                          <td>El jugador a la derecha del juez (Jugador 2), juega doble (tiene doble oportunidad de ganar)</td>
                        </tr>
                        <tr>
                          <td>
                            <img className='dice-side' src='images/dado-lado1.jpg' alt='icon' />
                          </td>
                          <td>El jugador 2 no juega ese turno</td>
                        </tr>
                        <tr>
                          <td>
                            <img className='dice-side' src='images/dado-lado5.jpg' alt='icon' />
                          </td>
                          <td>Se agrega una del mazo al montón de cartas jugadas. Si esta carta es elegida por el juez, gana el jugador 2</td>
                        </tr>
                        <tr>
                          <td>
                            <img className='dice-side' src='images/dado-lado2.jpg' alt='icon' />
                          </td>
                          <td>El jugador 2 es el nuevo juez</td>
                        </tr>
                        <tr>
                          <td>
                            <img className='dice-side' src='images/dado-lado6.jpg' alt='icon' />
                          </td>
                          <td>El jugador 2 toma una carta del mazo. Juega 1 y se descarta 1</td>
                        </tr>
                        <tr>
                          <td>
                            <img className='dice-side' src='images/dado-lado3.jpg' alt='icon' />
                          </td>
                          <td>El jugador 2 descarta una carta, elegida al azar por el juez y juega esa mano con 6 cartas. Al finalizar la ronda, vuelve a jugar con 7 cartas</td>
                        </tr>
                      </tbody>
                    </table>
                  </li>
                </ol>
              </li>
            </ol>
          </section>
        </main>
      </div>
    )
  }
}

export default Help;