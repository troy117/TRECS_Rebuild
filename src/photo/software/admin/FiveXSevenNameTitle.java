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


public class FiveXSevenNameTitle 
{

	
	BufferedImage bImage, stuImage, template;
	Graphics2D g;
	File largeImage;
	String name, title;
	FontMetrics fm;
	Rectangle2D rect;
	
	public FiveXSevenNameTitle(ArrayList<Student> students, String imageFolder, String outputFolder)
	{
		int i=0;
		try
		{
			template = ImageIO.read(new File("Templates\\FALL\\STAFF 5X7.png"));
			for(Student s:students)
			{
				bImage = new BufferedImage(1650,2250,BufferedImage.TYPE_INT_RGB);
				g = bImage.createGraphics();
				g.setColor(Color.white);
				g.fillRect(0, 0, 1650, 2250);
				largeImage = new File(imageFolder+"\\"+s.ref+".jpg");
				if(largeImage.exists())
				{
					try
					{
						stuImage = ImageIO.read(largeImage);
						g.drawImage(stuImage.getScaledInstance(1550, -1, Image.SCALE_SMOOTH),50,158,null);
						stuImage.flush();
						stuImage = null;
						
						g.drawImage(template, 0, 0, null);
						
						g.setColor(Color.black);
						
						g.setFont(new Font("Arial",Font.PLAIN,100));
						name = WordUtils.capitalizeFully(s.first+" "+s.last);
						fm = g.getFontMetrics();
						rect = fm.getStringBounds(name, g);
						g.drawString(name, 825-((int)rect.getWidth()/2),2010);
						
						g.setFont(new Font("Arial",Font.PLAIN,65));
						title = WordUtils.capitalizeFully(s.field1);
						fm = g.getFontMetrics();
						rect = fm.getStringBounds(title, g);
						g.drawString(title, 825-((int)rect.getWidth()/2),2080);
						
						ImageIO.write(bImage, "jpg", new File(outputFolder+"\\"+s.last+"_"+i+".jpg"));
						i++;
						
						g.dispose();
						bImage.flush();
						bImage = null;
					}catch(Exception e){JOptionPane.showMessageDialog(null, "Error: "+e);}
				}
			}
			template.flush();
			template = null;		
		}catch(Exception e){JOptionPane.showMessageDialog(null, e.getMessage());}
	}
}
