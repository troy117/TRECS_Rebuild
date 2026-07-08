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

import photo.software.student.Student;

public class FourXFiveExport 
{
	BufferedImage bImage, stuImage;
	Graphics2D g;
	File largeImage;
	String name;
	FontMetrics fm;
	Rectangle2D rect;
	
	public FourXFiveExport(ArrayList<Student> students, String imageFolder, String outputFolder)
	{
		int i=0;
		for(Student s:students)
		{
			bImage = new BufferedImage(1200,1575,BufferedImage.TYPE_INT_RGB);
			g = bImage.createGraphics();
			g.setColor(Color.white);
			g.fillRect(0, 0, 1200, 1575);
			largeImage = new File(imageFolder+"\\"+s.ref+".jpg");
			if(largeImage.exists())
			{
				try
				{
					stuImage = ImageIO.read(largeImage);
					g.drawImage(stuImage.getScaledInstance(1200,-1,Image.SCALE_SMOOTH), 0, 0, null);
					stuImage.flush();
					stuImage = null;
					
					g.setColor(Color.black);
					g.setFont(new Font("Arial",Font.PLAIN,35));
					name = (s.grade+": "+s.first+" "+s.last);
					g.drawString(name, 100, 1550);
					
					ImageIO.write(bImage, "jpg", new File(outputFolder+"\\"+s.grade+"_"+s.last+"_"+s.first+"_"+i+".jpg"));
				}catch(Exception e){JOptionPane.showMessageDialog(null, "Error: "+e);}
			}
		}
	}
}
