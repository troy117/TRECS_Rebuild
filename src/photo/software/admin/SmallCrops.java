package photo.software.admin;

import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.Arrays;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageTypeSpecifier;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.metadata.IIOMetadata;
import javax.imageio.stream.ImageOutputStream;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JProgressBar;

import org.w3c.dom.Element;



public class SmallCrops 
{
	
	String schoolPath,largePath;
	JProgressBar progressBar;
	JFrame frame;
	BufferedImage img,bufThumb,bufVer;
	File outThmb,outVer;
	Image thumbImg,verified;
	ImageWriter imageWriter;
	ImageOutputStream ios;
	ImageWriteParam jpegParams;
	IIOMetadata data;
	Element tree,jfif;
	public SmallCrops()
	{
		JFileChooser fc = new JFileChooser();
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = fc.showOpenDialog(null);
		if(returnVal==JFileChooser.APPROVE_OPTION)
		{
			schoolPath = fc.getSelectedFile().getAbsolutePath();
			startCrop();
		}
	}
	public SmallCrops(File croppedLarge)
	{
		largePath = croppedLarge.getAbsolutePath();
		new File(largePath+"\\CroppedMed").mkdir();
		startCropMed();
	}
	public void startCropMed()
	{
		frame = new JFrame("Creating Med Images");
		frame.setSize(new Dimension(300,50));
		frame.setVisible(true);
		frame.setResizable(false);
		
		new Thread(new Runnable(){
			public void run(){
				progressBar = new JProgressBar(0,100);
				frame.add(progressBar);
				
				File[] images = (new File(largePath)).listFiles(new FilenameFilter()
				{
					public boolean accept(File dir, String name) {return name.toUpperCase().endsWith(".JPG");}
				});
				Arrays.sort(images);
				for(int i=0;i<images.length;i++)
				{
					progressBar.setValue((i*100)/images.length);
					medImageMaker(images[i]);
				}
				progressBar.setValue(100);
				JOptionPane.showMessageDialog(null, "Complete!");
				frame.dispose();
			}
		}).start();
		System.gc();
	}
	public void startCrop()
	{
		frame = new JFrame("Creating Small Images");
		frame.setSize(new Dimension(300,50));
		frame.setVisible(true);
		frame.setResizable(false);
		
		new Thread(new Runnable(){
			public void run(){
				progressBar = new JProgressBar(0,100);
				frame.add(progressBar);
				
				File[] images = (new File(schoolPath+"\\CroppedLarge")).listFiles(new FilenameFilter()
				{
					public boolean accept(File dir, String name) {return name.toUpperCase().endsWith(".JPG");}
				});
				Arrays.sort(images);
				
				
				for(int i=0;i<images.length;i++)
				{
					progressBar.setValue((i*100)/images.length);
					smallImageMaker(images[i]);
				}
				progressBar.setValue(100);
				JOptionPane.showMessageDialog(null, "Complete!");
				frame.dispose();
			}
		}).start();
		System.gc();
	}
	private void medImageMaker(File f)
	{
		try{
			int dpi = 300;
			img = ImageIO.read(f);
			
			outThmb = new File(largePath+"\\CroppedMed\\"+f.getName());	
			thumbImg = img.getScaledInstance(600, -1, Image.SCALE_SMOOTH);
			
			bufThumb = toBufferedImage(thumbImg,BufferedImage.TYPE_INT_RGB);
			
			imageWriter = ImageIO.getImageWritersBySuffix("jpeg").next();
			ios = ImageIO.createImageOutputStream(outThmb);
			imageWriter.setOutput(ios);
			jpegParams = imageWriter.getDefaultWriteParam();

			data = imageWriter.getDefaultImageMetadata(
					new ImageTypeSpecifier(bufThumb), jpegParams);
			
			tree = (Element)data.getAsTree("javax_imageio_jpeg_image_1.0");
			jfif = (Element)tree.getElementsByTagName("app0JFIF").item(0);
			jfif.setAttribute("Xdensity", Integer.toString(dpi));
			jfif.setAttribute("Ydensity", Integer.toString(dpi));
			jfif.setAttribute("resUnits", "1"); // density is dots per inch                 
			data.mergeTree("javax_imageio_jpeg_image_1.0",tree);
			
			imageWriter.write(data, new IIOImage(bufThumb, null, data), jpegParams);
			ios.close();
			imageWriter.dispose();
			
		}catch(IOException e){JOptionPane.showMessageDialog(null, "Error: "+f.getPath()+" "+e);}
	}
	private void smallImageMaker(File f)
	{
		try{
			int dpi = 300;
			img = ImageIO.read(f);
			
			outThmb = new File(schoolPath+"\\CroppedSmall\\"+f.getName());	
			thumbImg = img.getScaledInstance(320, -1, Image.SCALE_SMOOTH);
			
			bufThumb = toBufferedImage(thumbImg,BufferedImage.TYPE_INT_RGB);
			
			imageWriter = ImageIO.getImageWritersBySuffix("jpeg").next();
			ios = ImageIO.createImageOutputStream(outThmb);
			imageWriter.setOutput(ios);
			jpegParams = imageWriter.getDefaultWriteParam();

			data = imageWriter.getDefaultImageMetadata(
					new ImageTypeSpecifier(bufThumb), jpegParams);
			
			tree = (Element)data.getAsTree("javax_imageio_jpeg_image_1.0");
			jfif = (Element)tree.getElementsByTagName("app0JFIF").item(0);
			jfif.setAttribute("Xdensity", Integer.toString(dpi));
			jfif.setAttribute("Ydensity", Integer.toString(dpi));
			jfif.setAttribute("resUnits", "1"); // density is dots per inch                 
			data.mergeTree("javax_imageio_jpeg_image_1.0",tree);
			
			imageWriter.write(data, new IIOImage(bufThumb, null, data), jpegParams);
			ios.close();
			
			outVer = new File(schoolPath+"\\CroppedMed\\"+f.getName());
			verified = img.getScaledInstance(600, -1, Image.SCALE_SMOOTH);

			bufVer = toBufferedImage(verified,BufferedImage.TYPE_INT_RGB);
			ios = ImageIO.createImageOutputStream(outVer);
			imageWriter.setOutput(ios);
			data = imageWriter.getDefaultImageMetadata(
					new ImageTypeSpecifier(bufVer), jpegParams);
			tree = (Element)data.getAsTree("javax_imageio_jpeg_image_1.0");
			jfif = (Element)tree.getElementsByTagName("app0JFIF").item(0);
			jfif.setAttribute("Xdensity", Integer.toString(dpi));
			jfif.setAttribute("Ydensity", Integer.toString(dpi));
			jfif.setAttribute("resUnits", "1"); // density is dots per inch                 
			data.mergeTree("javax_imageio_jpeg_image_1.0",tree);
				
			imageWriter.write(data, new IIOImage(bufVer, null, data), jpegParams);
			ios.close();
			
			imageWriter.dispose();
			
		}catch(IOException e){JOptionPane.showMessageDialog(null, "Error: "+f.getPath()+" "+e);}
	}
	
    private static BufferedImage toBufferedImage(Image image, int type) {
        int w = image.getWidth(null);
        int h = image.getHeight(null);
        BufferedImage result = new BufferedImage(w, h, type);
        Graphics2D g = result.createGraphics();
        g.drawImage(image, 0, 0, null);
        g.dispose();
        return result;
    }
}
