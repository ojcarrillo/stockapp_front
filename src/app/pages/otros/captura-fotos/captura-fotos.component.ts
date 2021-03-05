import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS, URL_UPLOAD_FILE } from '../../../shared/app-settings.module';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-captura-fotos',
  templateUrl: './captura-fotos.component.html',
  styleUrls: ['./captura-fotos.component.css']
})
export class CapturaFotosComponent implements OnInit {

  webcamImage: WebcamImage = null;
  file: string;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }

  async guardarFoto() {
    this.file = `${this.webcamImage.imageAsBase64}`;
    const serial = Math.floor(Math.random() * (2500000 - 1)) + 1;
    const data = {
      file: `${this.webcamImage.imageAsBase64}`,
      filename: `img_${serial}.jpg`
    };
    return this.http.post(URL_UPLOAD_FILE, data)
      .subscribe((resp: any) => {
        console.log(resp);
        this.file = resp.fileDownloadUri;
      });
  }

}
