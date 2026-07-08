package photo.software.composites;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;

import javax.imageio.ImageIO;
import javax.swing.JFileChooser;
import javax.swing.JOptionPane;

import photo.software.comparators.StudentLastNameSortComparator;
import photo.software.student.Student;

public class ManualCompositeBuilder 
{
	ArrayList<Student> students;
	int w,h,x,y,c,r;
	double pageWidth, pageHeight;
	BufferedImage bImage, img;
	Graphics2D g;
	String stuImage,outputPath,name;
	Font nameFont = new Font("Arial",Font.PLAIN,20);
	public ManualCompositeBuilder(ArrayList<Student> students, String w, String x, String y, 
			String columns, String schoolPath,String name)
	{
		this.students = students;
		Collections.sort(students, new StudentLastNameSortComparator());
		stuImage = schoolPath+"\\CroppedMed";
		JFileChooser fc = new JFileChooser();
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = fc.showOpenDialog(null);
		if(returnVal==JFileChooser.APPROVE_OPTION) outputPath = fc.getSelectedFile().getAbsolutePath();
		else
		{
			JOptionPane.showMessageDialog(null, "Must Choose Output Directory!");
			return;
		}
		this.name = name;
		boolean allInt = false;
		try
		{
			this.w = Integer.parseInt(w);
			this.x = Integer.parseInt(x);
			this.y = Integer.parseInt(y);
			this.c = Integer.parseInt(columns);
			r=students.size()/c;
			if(students.size()%c!=0) r++;
			h = (int)((this.w)*1.25+.5);
			allInt = true;
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Please only use integers");}
		if(allInt) startBuild();
	}
	public void startBuild()
	{
		int xPos,yPos;
		pageWidth = c*(x+w)+x;
		pageHeight = r*(y+h)+y;
		try
		{
			bImage = new BufferedImage((int)pageWidth,(int)pageHeight,BufferedImage.TYPE_INT_RGB);
			g = bImage.createGraphics();
			g.setColor(Color.white);
			g.fillRect(0, 0, (int)pageWidth, (int)pageHeight);
			g.setColor(Color.black);
			for(int i=0;i<students.size();i++)
			{
				xPos = (i%c)*(w+x) +x;
				yPos = (i/c)*(h+y)+y;
				builder(students.get(i),xPos,yPos);
			}
			ImageIO.write(bImage, "jpg", new File(outputPath+"\\"+name+"_BigExport.jpg"));
			g.dispose();
			bImage.flush();
			bImage = null;
			System.gc();
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Error somewhere: "+e);}
		
	}
	public void builder(Student s, int xPos, int yPos)
	{
		File f = new File(stuImage+"\\"+s.ref+".jpg");
		try
		{
			if(f.exists())
			{
				g.fillRect(xPos-2, yPos-2, w+4, h+4);
				img = ImageIO.read(f);
				g.drawImage(img.getScaledInstance(w, -1, Image.SCALE_SMOOTH),xPos,yPos,null);
				img.flush();
				img = null;
				nameWriter(s,xPos,yPos);
			}
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error: "+s.ref+": "+e);}
		
	}
	public void nameWriter(Student s, int xPos, int yPos)
	{
		g.setFont(nameFont);
		int firstLen = (int)g.getFontMetrics().getStringBounds(s.first, g).getWidth();
		while(firstLen>w)
		{
			g.setFont(new Font(g.getFont().getFontName(),g.getFont().getStyle(),g.getFont().getSize()-2));
			firstLen = (int)g.getFontMetrics().getStringBounds(s.first, g).getWidth();
		}
		g.drawString(s.first, xPos+((w/2)-(firstLen/2)), yPos+h+20);
		g.setFont(nameFont);
		int lastLen = (int)g.getFontMetrics().getStringBounds(s.last, g).getWidth();
		while(lastLen>w)
		{
			g.setFont(new Font(g.getFont().getFontName(),g.getFont().getStyle(),g.getFont().getSize()-2));
			lastLen = (int)g.getFontMetrics().getStringBounds(s.last, g).getWidth();
		}
		g.drawString(s.last, xPos+((w/2)-(lastLen/2)), yPos+h+40);
	}
	
}
