﻿using Ionic.Zip;
using Ionic.Zlib;

namespace Sen.Shell.Modules.Standards
{

    public abstract class Abstract_Compress
    {
        public abstract void CompressZip(string zip_output, string[] files, string[] directories);

        public abstract Task CompressZipAsync(string zip_output, string[] files, string[] directories);

        public abstract void UncompressZip(string zip_input, string extracted_directory);

        public abstract Task UncompressZipAsync(string zip_input, string extracted_directory);

        public abstract byte[] CompressZlibBytes<Generic_T>(Generic_T data, ZlibCompressionLevel compression_level);

        public abstract byte[] UncompressZlibBytes<Generic_T>(Generic_T zlibData) where Generic_T : IList<byte>;

    }
    public enum ZlibCompressionLevel
    {
        Level0,
        Level1,
        Level2,
        Level3,
        Level4,
        Level5,
        Level6,
        Level7,
        Level8,
        Level9,
        None,
        BestCompression,
        BestSpeed,
        Default,
    }


    public class Compress : Abstract_Compress
    {


        public override void CompressZip(string zip_output, string[] files, string[] directories)
        {
            using var zip = new ZipFile();
            {
                if (files != null)
                {
                    foreach (string file in files)
                    {
                        zip.AddFile(file);
                    }
                }

                if (directories != null)
                {
                    foreach (string directory in directories)
                    {
                        zip.AddDirectory(directory);
                    }
                }

                zip.Save(zip_output);
            }

            return;
        }


        public override async Task CompressZipAsync(string zipOutput, string[] files, string[] directories)
        {
            await Task.Run(() =>
            {
                using var zip = new ZipFile();
                if (files != null)
                {
                    foreach (string file in files)
                    {
                        zip.AddFile(file);
                    }
                }

                if (directories != null)
                {
                    foreach (string directory in directories)
                    {
                        zip.AddDirectory(directory);
                    }
                }

                zip.Save(zipOutput);
            });
            return;
        }


        public override byte[] CompressZlibBytes<Generic_T>(Generic_T data, ZlibCompressionLevel compression_level)
        {
            var compressionLevel = compression_level switch
            {
                ZlibCompressionLevel.Level0 => CompressionLevel.Level0,
                ZlibCompressionLevel.Level1 => CompressionLevel.Level1,
                ZlibCompressionLevel.Level2 => CompressionLevel.Level2,
                ZlibCompressionLevel.Level3 => CompressionLevel.Level3,
                ZlibCompressionLevel.Level4 => CompressionLevel.Level4,
                ZlibCompressionLevel.Level5 => CompressionLevel.Level5,
                ZlibCompressionLevel.Level6 => CompressionLevel.Level6,
                ZlibCompressionLevel.Level7 => CompressionLevel.Level7,
                ZlibCompressionLevel.Level8 => CompressionLevel.Level8,
                ZlibCompressionLevel.Level9 => CompressionLevel.Level9,
                ZlibCompressionLevel.None => CompressionLevel.None,
                ZlibCompressionLevel.BestCompression => CompressionLevel.BestCompression,
                ZlibCompressionLevel.BestSpeed => CompressionLevel.BestSpeed,
                _ => CompressionLevel.Default,

            };
            byte[] dataBytes;
            if (data is byte[] byteArray)
            {
                dataBytes = byteArray;
            }
            else if (data is Array array && array.GetType().GetElementType() == typeof(byte))
            {
                dataBytes = array.Cast<byte>().ToArray();
            }
            else
            {
                throw new Exception($"invalid_zlib");
            }
            try
            {

                using var memoryStream = new MemoryStream(dataBytes);
                using var zlibStream = new ZlibStream(memoryStream, CompressionMode.Compress, compressionLevel);
                using var outputStream = new MemoryStream();
                {
                    zlibStream.CopyTo(outputStream);
                    return outputStream.ToArray();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public override void UncompressZip(string zip_input, string extracted_directory)
        {
            try{
                using var zip = ZipFile.Read(zip_input);
                {
                    zip.ExtractAll(extracted_directory);
                }
            }
            catch(Exception ex)
            {
                throw new Exception($"{ex.Message}");
            }
            return;
        }


        public override async Task UncompressZipAsync(string zip_input, string extracted_directory)
        {
            await Task.Run(() =>
            {
                using var zip = ZipFile.Read(zip_input);
                {
                    zip.ExtractAll(extracted_directory);
                }
            });
            return;
        }

        public override byte[] UncompressZlibBytes<Generic_T>(Generic_T zlibData)
        {
            byte[] zlibBytes;

            if (zlibData is byte[] byteArray)
            {
                zlibBytes = byteArray;
            }
            else if (zlibData is Array array && array.GetType().GetElementType() == typeof(byte))
            {
                zlibBytes = array.Cast<byte>().ToArray();
            }
            else
            {
                throw new Exception($"invalid_zlib");
            }
            try
            {


                using var inputStream = new MemoryStream(zlibBytes);
                using var zlibStream = new ZlibStream(inputStream, CompressionMode.Decompress);
                using var outputStream = new MemoryStream();
                {
                    zlibStream.CopyTo(outputStream);
                    return outputStream.ToArray();
                }
            }

            catch (Exception e) { 
                throw new Exception(e.Message);
            }
        }
    }
}
