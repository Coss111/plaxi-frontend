import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;
  selectedFile: File | null = null; // Archivo seleccionado
  fileError: string | null = null; // Error relacionado con el archivo
  previewUrl: string | ArrayBuffer | null = null; // URL de vista previa de la imagen

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar // Se inyecta MatSnackBar
  ) {}

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      descripcion: ['', [Validators.maxLength(250)]],
      portada: [null], // Cambiar a null ya que no se usará una URL directa
      dificultad: ['Beginner', Validators.required],
      estado: [true, Validators.required],
      Categoria_id_categoria: [0, [Validators.required, Validators.min(1)]],
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
      if (validExtensions.includes(file.type)) {
        this.selectedFile = file;
        this.fileError = null;

        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result;
        };
        reader.readAsDataURL(file);

        this.courseForm.patchValue({ portada: file.name });
      } else {
        this.fileError = 'Por favor, selecciona un archivo con formato .jpg, .jpeg o .png';
        this.selectedFile = null;
        this.previewUrl = null;
      }
    }
  }

  onSubmit() {
    if (this.courseForm.valid && this.selectedFile) {
      // Simulamos una creación exitosa del curso
      console.log('Course Created:', this.courseForm.value);
      console.log('Selected File:', this.selectedFile);

      // Mostramos el snackbar con el mensaje de éxito
      this.snackBar.open('¡El curso se ha creado exitosamente!', 'Cerrar', {
        duration: 3000, // Duración del snackbar en milisegundos
        horizontalPosition: 'center', // Posición horizontal
        verticalPosition: 'top', // Posición vertical
        panelClass: ['success-snackbar'] // Clase personalizada para el estilo del snackbar
      });

      // Redirigimos a la lista de cursos después de un breve retraso
      setTimeout(() => {
        this.router.navigate(['/my-courses']);
      }, 3000);
    } else {
      if (!this.selectedFile) {
        this.fileError = 'Por favor, selecciona una imagen válida para la portada del curso.';
      }
      this.courseForm.markAllAsTouched();

      // Mostramos un snackbar con mensaje de error
      this.snackBar.open('Error al crear el curso. Por favor, revisa los campos.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  }

  onCancel() {
    this.router.navigate(['/my-courses']);
  }

  getErrorMessage(field: string): string {
    if (this.courseForm.get(field)?.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
    if (this.courseForm.get(field)?.hasError('maxlength')) {
      return `Máximo ${this.courseForm.get(field)?.errors?.['maxlength'].requiredLength} caracteres permitidos.`;
    }
    if (this.courseForm.get(field)?.hasError('min')) {
      return 'El valor debe ser mayor que cero.';
    }
    if (this.courseForm.get(field)?.hasError('pattern')) {
      return 'La URL debe ser válida y terminar en .png o .jpg';
    }
    return '';
  }
}
