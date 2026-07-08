package photo.software.admin;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import org.apache.commons.lang.WordUtils;

import photo.software.student.Student;


public class FiveXSevenExport 
{

	
	BufferedImage bImage, stuImage;
	Graphics2D g;
	File largeImage;
	String name;
	FontMetrics fm;
	Rectangle2D rect;
	
	public FiveXSevenExport(ArrayList<Student> students, String imageFolder, String outputFolder)
	{
		int i=0;
		for(Student s:students)
		{
			bImage = new BufferedImage(1500,2100,BufferedImage.TYPE_INT_RGB);
			g = bImage.createGraphics();
			g.setColor(Color.white);
			g.fillRect(0, 0, 1500, 2100);
			largeImage = new File(imageFolder+"\\"+s.ref+".jpg");
			if(largeImage.exists())
			{
				try
				{
					stuImage = ImageIO.read(largeImage);
					stuImage = stuImage.getSubimage(128, 0, 2143, stuImage.getHeight());
					g.drawImage(stuImage.getScaledInstance(1500, -1, Image.SCALE_SMOOTH),0,0,null);
					stuImage.flush();
					stuImage = null;
					
					g.setFont(new Font("Arial",Font.PLAIN,100));
					name = WordUtils.capitalizeFully(s.first+" "+s.last);
					fm = g.getFontMetrics();
					rect = fm.getStringBounds(name, g);
					
					g.setColor(Color.black);
					g.drawString(name, 753-((int)rect.getWidth()/2),2050);
					g.drawString(name, 747-((int)rect.getWidth()/2),2050);
					g.drawString(name, 750-((int)rect.getWidth()/2),2053);
					g.drawString(name, 750-((int)rect.getWidth()/2),2047);
					g.setColor(Color.white);
					g.drawString(name, 750-((int)rect.getWidth()/2),2050);
					
					ImageIO.write(bImage, "jpg", new File(outputFolder+"\\"+s.last+"_"+i+".jpg"));
					i++;
					
					g.dispose();
					bImage.flush();
					bImage = null;
				}catch(Exception e){JOptionPane.showMessageDialog(null, "Error: "+e);}
			}
			
		}
		
		
	}
	
}
