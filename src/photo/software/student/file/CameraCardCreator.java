package photo.software.student.file;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.GraphicsConfiguration;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.Transparency;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import photo.software.student.Student;


public class CameraCardCreator 
{
	private static int CARDSPERSHEET = 16;
	private ArrayList<Student> students;
	private String path,school;
	private BufferedImage bImage, cImage;
	private Graphics2D cG, bG, gResult;
	private boolean[] array;
	
	
	public CameraCardCreator(ArrayList<Student> renderList,String outputPath,String school)
	{
		this.school = school;
		students = renderList;
		array = new boolean[students.size()];
		for(int i=0;i<array.length;i++) array[i]=true;
		path = outputPath;
		beginProcess();
	}
	private void beginProcess()
	{
		try
		{
			bImage = new BufferedImage(5100,3300,BufferedImage.TYPE_INT_RGB);
			bG = bImage.createGraphics();
			bG.setColor(Color.white);
			bG.fillRect(0, 0, 5100, 3300);
			cImage = new BufferedImage(1275,825,BufferedImage.TYPE_INT_RGB);
			cG = cImage.createGraphics();

		}
		catch(Exception e){JOptionPane.showMessageDialog(null, "Error Card Creator: "+e);}
		stackCut();
	}
	private void stackCut()
	{
		//The total number of pages to be printed out
		int stack = students.size()/CARDSPERSHEET;
		if(students.size()%CARDSPERSHEET!=0) stack++;
		int page=0;
		
		try
		{
			for(page=0;page<stack;page++)
			{
				for(int card=0;card<CARDSPERSHEET;card++)
				{
					if((card*stack)+page<students.size())
					{
						createStudentCard(students.get((card*stack)+page));
						bG.drawImage(cImage, (card%4)*1275, (card/4)*825,null);
					}
				}
				//Write Cards
				bG.setColor(Color.black);
				bG.setFont(new Font("Arial",Font.PLAIN,25));
				bG.drawString("CCPage_"+(page+1)+"_STACK CUT", 2350, 75);

				ImageIO.write(bImage,"jpg", new File(path+"\\CCPage_"+(page+1)+"_StackCut.jpg"));
				
				//Write Cards
				bG.setColor(Color.white);
				bG.fillRect(0, 0, 5100, 3300);
			}
			
			
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error writing card: "+e+"\n On page: "+page);}
	}
	private void createStudentCard(Student s)
	{
		try
		{
			BufferedImage vert = new BufferedImage(825,200,BufferedImage.TYPE_INT_RGB);
			Graphics2D vT = (vert).createGraphics();
			vT.setColor(Color.white);
			vT.fillRect(0,0,825,200);
			vT.setColor(Color.black);
			vT.setFont(new Font("Arial",Font.PLAIN,50));
			vT.drawString(s.grade+"     "+s.last+", "+s.first,70, 120);
			vT.drawString(s.ref+" - "+school,70, 180);
			
			cG.setColor(Color.white);
			cG.fillRect(0, 0, 1275,825);
			cG.drawImage(rotate(vert), 0, 0, null);
			
			cG.setColor(Color.black);
			cG.setFont(new Font("Arial",Font.PLAIN,50));
			cG.drawString(s.last+", "+s.first, 250, 140);
			cG.drawString("Grade: "+s.grade, 250, 400);
			cG.drawString("Homeroom: "+s.homeroom, 250, 460);
			cG.drawString("Track: "+s.track, 250, 520);
			cG.drawString(s.ID, 250, 580);
			cG.setFont(new Font("Code39FiveText",Font.PLAIN,100));
			cG.drawString("*"+s.ref+"*", 250, 730);			
			
		}
		catch(Exception e){JOptionPane.showMessageDialog(null, "Error Card Creator: "+e);}
	}
	
    public static GraphicsConfiguration getDefaultConfiguration() {
        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        GraphicsDevice gd = ge.getDefaultScreenDevice();
        return gd.getDefaultConfiguration();
    }
    public BufferedImage rotate(BufferedImage image) {
        double sin = Math.abs(Math.sin(Math.toRadians(-90))), cos = Math.abs(Math.cos(Math.toRadians(-90)));
        int w = image.getWidth(), h = image.getHeight();
        int neww = (int)Math.floor(w*cos+h*sin), newh = (int)Math.floor(h*cos+w*sin);
        GraphicsConfiguration gc = getDefaultConfiguration();
        BufferedImage result = gc.createCompatibleImage(neww, newh, Transparency.TRANSLUCENT);
        gResult = result.createGraphics();
        gResult.translate((neww-w)/2, (newh-h)/2);
        gResult.rotate((Math.toRadians(-90)), w/2, h/2);
        gResult.drawRenderedImage(image, null);
        gResult.dispose();
        return result;
    }
}
