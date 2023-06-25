﻿using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Support.PvZ2.RTON;
using Sen.Shell.Modules.Support.PvZ2.PAM;
using Sen.Shell.Modules.Support.PvZ2.RSG;
using Sen.Shell.Modules.Support.PvZ2.RSB;
using Sen.Shell.Modules.Standards.IOModule;
using Sen.Shell.Modules.Support.Compress;
using Sen.Shell.Modules.Standards;
using WEMSharp;
using Sen.Shell.Modules.Support.WWise;
using static Sen.Shell.Modules.Support.PvZ2.RTON.RTONProcession;

namespace Sen.Shell.Modules.Support.PvZ2
{

    #region RTONHead
    public struct RTONHead
    {
        public string magic;
        public string end;
        public int version;
    }

    #endregion


    #region PAMHead

    public struct PAMHeader
    {
        public uint magic;
        public int version;
        public int frame_rate;
    }

    #endregion

    #region PvZ2Shell Abstract

    public abstract class PvZ2ShellAbstract
    {
        public abstract void RTONDecode(string inFile, string outFile, RTONCipher DecryptRTON);

        public abstract void RTONEncode(string inFile, string outFile, RTONCipher DecryptRTON);

        public abstract PAMInfo PAMtoPAMJSON(string inFile);

        public abstract void PAMJSONtoPAM(string PAMJson, string outFile);

        public abstract ExtraInfo PAMJSONtoFlashAnimation(string PAMJson, string outFolder, int resolution);

        public abstract PAMInfo FlashAnimationtoPAMJSON(string inFolder, ExtraInfo extraInfo);

        public abstract ExtraInfo PAMtoFlashAnimation(string inFile, string outFolder, int resolution);

        public abstract void FlashAnimationtoPAM(string inFolder, string outFile, ExtraInfo extraInfo);

        public abstract PacketInfo RSGUnpack(string inFile, string outFolder, bool useResDirectory);

        public abstract void PopCapZlibCompress(string ripefile, bool use64bitvariant, string outFile, ZlibCompressionLevel zlib_level);

        public abstract void PopCapZlibUncompress(string ripefile, bool use64bitvariant, string outFile);

        public abstract void RSGPack(string inFolder, string outFile, PacketInfo packet_info, bool useResDirectory);

        public abstract MainfestInfo RSBUnpack(string inRSBpath, string outFolder);

        public abstract void RSBPack(string RSBDirectory, string outRSB, MainfestInfo mainfestInfo);

        public abstract void RSBUnpackByLenient(string RSBin, string outRSBdirectory);

        public abstract void RSBObfuscate(string RSBin, string outRSB);

        public abstract WWiseInfoSimple WWiseSoundBankDecode(string bnk_in, string bnk_dir_out);

        public abstract void WWiseSoundBankEncode(string soundbank_dir, string out_bnk, WWiseInfoSimple information);

        public abstract RSB_head ProcessRSBData(string infile);

        public abstract RTONHead ProcessRTONData(string infile);

        public abstract PAMHeader ProcessPAMData(string inFile);

        public abstract void WemToOGG(string inFile, string outFile, string destination, bool inlineCodebook, bool inlineSetup);

        public abstract void RTONDecrypt(string inFile, string outFile, RTONCipher crypt);

        public abstract void RTONEncrypt(string inFile, string outFile, RTONCipher crypt);


    }

    #endregion

    #region Functions

    public class PvZ2Shell : PvZ2ShellAbstract
    {
        public override void RTONDecode(string inFile, string outFile, RTONCipher DecryptRTON)
        {
            var RtonFile = new SenBuffer(inFile);
            var JsonFile = RTONProcession.Decode(RtonFile, DecryptRTON);
            JsonFile.OutFile(outFile);
            return;
        }

        public override void RTONEncode(string inFile, string outFile, RTONCipher EncryptRTON)
        {
            var fs = new FileSystem();
            var JsonFile = fs.ReadBytes(inFile);
            var RtonFile = RTONProcession.Encode(JsonFile, EncryptRTON);
            RtonFile.OutFile(outFile);
            return;
        }

        public override PAMInfo PAMtoPAMJSON(string inFile)
        {
            var PAMFile = new SenBuffer(inFile);
            var PAMJson = PAM_Binary.Decode(PAMFile);
            return PAMJson;
        }

        public override void PAMJSONtoPAM(string PAMJson, string outFile)
        {
            var fs = new FileSystem();
            var PAMFile = PAM_Binary.Encode(fs.ReadJson<PAMInfo>(PAMJson));
            PAMFile.OutFile(outFile);
            return;
        }

        public override ExtraInfo PAMJSONtoFlashAnimation(string PAMJson, string outFolder, int resolution)
        {
            var fs = new FileSystem();
            var extraInfo = PAM_Animation.Decode(fs.ReadJson<PAMInfo>(PAMJson), outFolder, resolution);
            return extraInfo;
        }

        public override PAMInfo FlashAnimationtoPAMJSON(string inFolder, ExtraInfo extraInfo)
        {
            var PAMJson = PAM_Animation.Encode(inFolder, extraInfo);
            return PAMJson;
        }

         public override ExtraInfo PAMtoFlashAnimation(string inFile, string outFolder, int resolution)
        {
            var PAMFile = new SenBuffer(inFile);
            var PamInfo = PAM_Binary.Decode(PAMFile);
            var extraInfo = PAM_Animation.Decode(PamInfo, outFolder, resolution);
            return extraInfo;
        }

        public override void FlashAnimationtoPAM(string inFolder, string outFile, ExtraInfo extraInfo)
        {
            var PAMJson = PAM_Animation.Encode(inFolder, extraInfo);
            var PAMFile = PAM_Binary.Encode(PAMJson);
            PAMFile.OutFile(outFile);
            return;
        }

        public override PacketInfo RSGUnpack(string inFile, string outFolder, bool useResDirectory = true) {
            var RsgFile = new SenBuffer(inFile);
            var PacketInfo = RSGFunction.Unpack(RsgFile, outFolder, useResDirectory);
            return PacketInfo;
        }

        public override void RSGPack(string inFolder, string outFile, PacketInfo packet_info, bool useResDirectory = true) {
            var RSGFile = RSGFunction.Pack(inFolder, packet_info, useResDirectory);
            RSGFile.OutFile(outFile);
            return;
        }

        public override MainfestInfo RSBUnpack(string inRSBpath, string outFolder)
        {
            var buffer = new SenBuffer(inRSBpath);
            return RSBFunction.Unpack(buffer, outFolder);
        }

        public override void RSBPack(string RSBDirectory, string outRSB, MainfestInfo mainfestInfo)
        {
            RSBFunction.Pack(RSBDirectory, outRSB, mainfestInfo);
            return;
        }

        public override void RSBUnpackByLenient(string RSBin, string outRSBdirectory)
        {
            return;
        }

        public override void RSBObfuscate(string RSBin, string outRSB)
        {
            var RSBFile = new SenBuffer(RSBin);
            RSBFunction.RSBObfuscate(RSBFile);
            RSBFile.OutFile(outRSB);
            return;
        }


        public override WWiseInfoSimple WWiseSoundBankDecode(string bnk_in, string bnk_dir_out)
        {
            var wwise_soundbank = new SenBuffer(bnk_in);
            var wwise_json = WwiseFunction.DecodeSimple(wwise_soundbank, bnk_dir_out);
            return wwise_json;
        }

        public override void WWiseSoundBankEncode(string soundbank_dir, string out_bnk, WWiseInfoSimple information)
        {
            var wwise_soundbank = WwiseFunction.EncodeSimple(information, soundbank_dir);
            wwise_soundbank.OutFile(out_bnk);
            return;
        }

        public override void PopCapZlibCompress(string ripefile, bool use64bitvariant, string outFile, ZlibCompressionLevel zlib_level)
        {
            var zlib = new PopCapZlib();
            var zlib_data = zlib.ZlibCompress(new ZlibCompress() { 
                RipeFile = ripefile,
                Use64BitVariant = use64bitvariant, 
                ZlibLevel = zlib_level 
            });
            var fs = new FileSystem();
            fs.OutFile<byte[]>(outFile, zlib_data);
            return;
        }

        public override void PopCapZlibUncompress(string ripefile, bool use64bitvariant, string outFile)
        {
            var zlib = new PopCapZlib();
            var uncompresszlib_data = zlib.ZlibUncompress(ripefile, use64bitvariant);
            var fs = new FileSystem();
            fs.OutFile<byte[]>(outFile, uncompresszlib_data);
            return;
        }

        public override RSB_head ProcessRSBData(string infile)
        {
            var buffer = new SenBuffer(infile);
            return RSBFunction.ReadHead(buffer);
        }

        public override RTONHead ProcessRTONData(string infile)
        {
            var RtonFile = new SenBuffer(infile);
            var Rton_magic = RtonFile.readString(4);
            var Rton_ver = RtonFile.readUInt32LE();
            var EOF = RtonFile.readString(4, RtonFile.length - 4);
            return new RTONHead()
            {
                version = (int)Rton_ver,
                magic = Rton_magic,
                end = EOF
            };
        }

        public override PAMHeader ProcessPAMData(string inFile)
        {
            var buffer = new SenBuffer(inFile);
            var magic = buffer.readUInt32LE();
            int version = buffer.readInt32LE();
            int frame_rate = buffer.readUInt8();
            return new PAMHeader()
            {
                version = version,
                frame_rate = frame_rate,
                magic = magic,
            };
        }

        public override void WemToOGG(string inFile, string outFile, string destination, bool inlineCodebook, bool inlineSetup)
        {
            var wem = new WEMFile(inFile, WEMForcePacketFormat.NoForcePacketFormat);
            wem.GenerateOGG(outFile, destination, inlineCodebook, inlineSetup);
            return;
        }

        public override void RTONDecrypt(string inFile, string outFile, RTONCipher crypt)
        {
            var buffer = new SenBuffer(inFile);
            var rton = RTONProcession.Decrypt(buffer, crypt.key);
            rton.OutFile(outFile);
            return;
        }

        public override void RTONEncrypt(string inFile, string outFile, RTONCipher crypt)
        {
            var buffer = new SenBuffer(inFile);
            var rton = RTONProcession.Encrypt(buffer, crypt.key);
            rton.OutFile(outFile);
            return;
        }

        #endregion
    }
}