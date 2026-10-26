import { calculateStatus, formatTime } from './utils.js';

describe('Pruebas unitarias de utils.js', () => {
  
  describe('calculateStatus', () => {
    it('debería retornar "Success" para puntajes de 90 o más', () => {
      expect(calculateStatus(95)).toBe('Success');
      expect(calculateStatus(90)).toBe('Success');
    });

    it('debería retornar "Warning" para puntajes entre 70 y 89', () => {
      expect(calculateStatus(85)).toBe('Warning');
      expect(calculateStatus(70)).toBe('Warning');
    });

    it('debería retornar "Error" para puntajes menores a 70', () => {
      // Corregido: la función retorna 'Error' (el test esperaba 'Fallo', que no existe)
      expect(calculateStatus(50)).toBe('Error');
    });

    it('debería respetar los límites entre categorías', () => {
      expect(calculateStatus(89)).toBe('Warning');
      expect(calculateStatus(69)).toBe('Error');
      expect(calculateStatus(100)).toBe('Success');
      expect(calculateStatus(0)).toBe('Error');
    });
  });

  describe('formatTime', () => {
    it('debería devolver un string en formato HH:MM', () => {
      const date = new Date('2023-10-15T08:05:00');
      expect(formatTime(date)).toBe('08:05');
    });

    it('debería rellenar con ceros a medianoche', () => {
      expect(formatTime(new Date('2023-10-15T00:00:00'))).toBe('00:00');
    });
  });
});
