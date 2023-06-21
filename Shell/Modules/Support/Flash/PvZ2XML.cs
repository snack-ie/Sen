﻿using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Support.PvZ2.PAM;
using System.Xml.Serialization;
using System.Xml;
using ImageInfo = Sen.Shell.Modules.Support.PvZ2.PAM.ImageInfo;
using SpriteInfo = Sen.Shell.Modules.Support.PvZ2.PAM.SpriteInfo;
using System.Dynamic;
using System.Xml.Linq;
using System.Text;
using System.Collections;
using System.Reflection.Metadata;

namespace Sen.Shell.Modules.Support.Flash
{
    using Object = Shell.Modules.Standards.Object;
    #region Abstract XML Class

    public abstract class XMLWrite
    {
        public abstract void WriteImageDocument(int index, string name, int[] size, double[] transform, string outpath);

        public abstract void WriteSourceDocument(int index, string name, int[] size, double[] transform, int resolution, string outpath);
    }

    #endregion


    #region PvZ2 XML

    public class PvZ2XML : XMLWrite
    {
        public PvZ2XML() { }
        
        public override void WriteImageDocument(int index, string name, int[] size, double[] transform, string outpath)
        {
            var image = new ImageInfo()
            {
                name = name,
                size = size,
                transform = transform
            };
            var image_document = PAM_Animation.WriteImageDocument(index, image);
            SenBuffer.SaveXml(outpath, image_document, PAM_Animation.xflns);
            return;
        }

        public override void WriteSourceDocument(int index, string name, int[] size, double[] transform, int resolution, string outpath)
        {
            var image = new ImageInfo()
            {
                name = name,
                size = size,
                transform = transform
            };
            var source_document = PAM_Animation.WriteSourceDocument(index, image, resolution);
            SenBuffer.SaveXml(outpath, source_document, PAM_Animation.xflns);
            return;
        }
    }
    #endregion


    public static class ExpandoObjectExtensions
    {
        public static XElement ToXElement(this ExpandoObject expando, string elementName)
        {
            var element = new XElement(elementName);
            foreach (var item in expando)
            {
                if (item.Value is ExpandoObject)
                {
                    element.Add(ToXElement((ExpandoObject)item.Value, item.Key));
                }
                else
                {
                    element.Add(new XAttribute(item.Key, item.Value));
                }
            }
            return element;
        }
    }

    public class XmlHelper
    {
        public static ExpandoObject Deserialize(string xmlString)
        {
            var document = XDocument.Parse(xmlString);
            var expando = new ExpandoObject();
            var dictionary = (IDictionary<string, object>)expando;
            dictionary[document.Root.Name.LocalName] = Deserialize(document.Root);
            return expando;
        }

        private static dynamic Deserialize(XElement element)
        {
            var expando = new ExpandoObject();
            var dictionary = (IDictionary<string, object>)expando;
            foreach (var attribute in element.Attributes())
            {
                if (attribute.Name.LocalName == "xsi" && attribute.Name.Namespace == XNamespace.Xmlns)
                {
                    dictionary["xsi"] = attribute.Value;
                }
                else
                {
                    dictionary[attribute.Name.LocalName] = attribute.Value;
                }
            }
            foreach (var childElement in element.Elements())
            {
                if (dictionary.ContainsKey(childElement.Name.LocalName))
                {
                    if (dictionary[childElement.Name.LocalName] is List<dynamic> list)
                    {
                        list.Add(Deserialize(childElement));
                    }
                    else
                    {
                        dictionary[childElement.Name.LocalName] = new List<dynamic>
                {
                    dictionary[childElement.Name.LocalName],
                    Deserialize(childElement)
                };
                    }
                }
                else
                {
                    dictionary[childElement.Name.LocalName] = Deserialize(childElement);
                }
            }
            if (!dictionary.Any())
            {
                return element.Value;
            }
            return expando;
        }



        public static void Serialize(ExpandoObject expando, string outpath)
        {
            #pragma warning disable CS8619
            SenBuffer.SaveXml(outpath, expando.ToXElement("root"), "");
            return;
        }


        private static void CreateSerialize(XmlWriter xmlWriter, ExpandoObject expando)
        {
            var dictionary = (IDictionary<string, object>)expando;
            foreach (var keyValuePair in dictionary)
            {
                if (keyValuePair.Key == "xmlns")
                {
                    xmlWriter.WriteAttributeString("xmlns", keyValuePair.Value.ToString());
                }
                else if (keyValuePair.Value is ExpandoObject)
                {
                    xmlWriter.WriteStartElement(keyValuePair.Key);
                    CreateSerialize(xmlWriter, (ExpandoObject)keyValuePair.Value);
                    xmlWriter.WriteEndElement();
                }
                else if (keyValuePair.Value is IEnumerable && !(keyValuePair.Value is string))
                {
                    foreach (var item in (IEnumerable)keyValuePair.Value)
                    {
                        xmlWriter.WriteStartElement(keyValuePair.Key);
                        CreateSerialize(xmlWriter, (ExpandoObject)item);
                        xmlWriter.WriteEndElement();
                    }
                }
                else
                {
                    xmlWriter.WriteAttributeString(keyValuePair.Key, keyValuePair.Value.ToString());
                }
            }
        }



    }
}
