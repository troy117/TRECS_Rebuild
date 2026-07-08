package photo.software.spring.render.addons;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import org.apache.commons.io.FileUtils;

import photo.software.spring.SpringStudent;
import photo.software.spring.render.RenderSpringOrderGUI;

public class SpringCDGenerator 
{
	private ArrayList<SpringStudent> cds;
	private String renderpath, schoolpath;
	private RenderSpringOrderGUI gui;
	
	private BufferedImage background, overlay;
	private Graphics2D bGraphics;
	
	
	public SpringCDGenerator(ArrayList<SpringStudent> cds, String schoolpath, String renderpath, RenderSpringOrderGUI gui)
	{
		this.cds = cds;
		this.schoolpath = schoolpath;
		this.renderpath = renderpath;
		this.gui = gui;
		
		start();
	}
	private void start()
	{
		if(cds.size()>0)
		{
			try
			{
				overlay = ImageIO.read(new File("Templates\\Spring\\CD_Template.jpg"));
				background = new BufferedImage(2550,1650,BufferedImage.TYPE_INT_RGB);
				bGraphics = background.createGraphics();
				
				bGraphics.setFont(new Font("Arial",Font.PLAIN, 80));
				for(int i=0;i<cds.size();i++)
				{
					bGraphics.setColor(Color.white);
					bGraphics.drawRect(0, 0, 2550, 1650);
					bGraphics.drawImage(overlay, 0, 0, null);
					bGraphics.setColor(Color.black);
					bGraphics.drawString(cds.get(i).first+" "+cds.get(i).last, 803,480);
					bGraphics.drawString(cds.get(i).first+" "+cds.get(i).last, 797,480);
					bGraphics.drawString(cds.get(i).first+" "+cds.get(i).last, 800,483);
					bGraphics.drawString(cds.get(i).first+" "+cds.get(i).last, 800,477);
					bGraphics.setColor(Color.white);
					bGraphics.drawString(cds.get(i).first+" "+cds.get(i).last, 800,480);
					writeFinal("CDcover_"+i+"_"+cds.get(i).last+"_"+cds.get(i).first+".jpg");
					FileUtils.copyFile(new File(schoolpath+"\\CroppedLarge\\"+cds.get(i).img), 
							new File(renderpath+"\\CDs_"+i+"_"+cds.get(i).last+"_"+cds.get(i).first+".jpg"));
					FileUtils.copyFile(new File(schoolpath+"\\SecondLook\\"+cds.get(i).img), 
							new File(renderpath+"\\CDs_"+i+"_"+cds.get(i).last+"_"+cds.get(i).first+"_SecondLook.jpg"));

					gui.updateProgressBar((i*100)/cds.size(),"CDs: "+cds.get(i).last+", "+cds.get(i).first);
				}
				overlay.flush();
				overlay = null;
				background.flush();
				background = null;
			}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading CD Template: "+e);return;}
		}
	}
	private void writeFinal(String text)
	{
		try
		{
			ImageIO.write(background, "jpg", new File(renderpath+"\\"+text));
		}
		catch(IOException e){JOptionPane.showMessageDialog(null, "Error Writing: "+text+"\n"+e);}
	}
}