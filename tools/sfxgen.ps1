Add-Type -Language CSharp -TypeDefinition @"
using System;
using System.IO;
public static class SfxGen {
  static void WriteWav(string path, double[] samples, int sr){
    int dataBytes = samples.Length * 2;
    using (var bw = new BinaryWriter(File.Create(path))) {
      bw.Write(System.Text.Encoding.ASCII.GetBytes("RIFF"));
      bw.Write(36 + dataBytes);
      bw.Write(System.Text.Encoding.ASCII.GetBytes("WAVE"));
      bw.Write(System.Text.Encoding.ASCII.GetBytes("fmt "));
      bw.Write(16);
      bw.Write((short)1);
      bw.Write((short)1);
      bw.Write(sr);
      bw.Write(sr * 2);
      bw.Write((short)2);
      bw.Write((short)16);
      bw.Write(System.Text.Encoding.ASCII.GetBytes("data"));
      bw.Write(dataBytes);
      for (int i=0;i<samples.Length;i++) {
        double v = Math.Max(-1.0, Math.Min(1.0, samples[i]));
        short s = (short)Math.Round(v * 32767);
        bw.Write(s);
      }
    }
  }
  static double[] Tone(int ms, double freq, double volume, double noise){
    int sr = 44100;
    int count = (int)(sr * ms / 1000.0);
    double[] arr = new double[count];
    int attack = (int)(sr*0.01);
    int decay = (int)(sr*0.05);
    Random rnd = new Random(42);
    for (int i=0;i<count;i++) {
      double t = i / 44100.0;
      double env = (i<attack) ? (i/(double)attack) : (i>count-decay ? (count - i)/(double)decay : 1.0);
      double val = volume * Math.Sin(2*Math.PI*freq*t);
      if (noise>0) val += noise * (rnd.NextDouble()*2.0 - 1.0);
      arr[i] = env * val;
    }
    return arr;
  }
  public static void MakeAll(){
    Directory.CreateDirectory("audio/sfx");
    WriteWav("audio/sfx/sfx_move.wav", Tone(100,700,0.6,0.0), 44100);
    WriteWav("audio/sfx/sfx_push.wav", Tone(200,150,0.7,0.15), 44100);
    WriteWav("audio/sfx/sfx_click.wav", Tone(60,1500,0.5,0.0), 44100);
    var s1 = Tone(350,523.25,0.5,0.0);
    var s2 = Tone(350,659.25,0.5,0.0);
    var s3 = Tone(350,783.99,0.5,0.0);
    double[] all = new double[s1.Length + s2.Length + s3.Length];
    Array.Copy(s1,0,all,0,s1.Length);
    Array.Copy(s2,0,all,s1.Length,s2.Length);
    Array.Copy(s3,0,all,s1.Length+s2.Length,s3.Length);
    WriteWav("audio/sfx/sfx_win.wav", all, 44100);
  }
}
"@

[SfxGen]::MakeAll();

