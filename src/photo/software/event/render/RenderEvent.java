package photo.software.event.render;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.GraphicsConfiguration;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.Image;
import java.awt.Transparency;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import photo.software.comparators.EventHomeroomSortComparator;
import photo.software.comparators.EventImageNumberSortComparator;
import photo.software.comparators.EventReferenceSortComparator;
import photo.software.event.EventGUI;
import photo.software.event.EventStudent;
import photo.software.login.JobData;

public class RenderEvent implements Runnable
{
	private ArrayList<EventStudent> students;
	private String schoolPath, schoolName;
	private String outputPath;
	private RenderGUI render;
	
	private BufferedImage bImage, cImage,hImage,vImage;
	private Graphics2D cG, bG, gResult;
	private static int CARDSPERSHEET = 4;
	private File horizTemp, vertTemp;
	boolean horizontal = false, templates = false;
	private JobData job;
	private int plan;
	private boolean renderLabels, includeIsland;
	
	public RenderEvent(EventGUI gui, ArrayList<EventStudent> students, String schoolPath, 
			String outputPath,int plan, int sort, RenderGUI render, boolean renderLabels, boolean includeIsland)
	{
		this.students = students;
		this.job = gui.job;
		this.schoolName = gui.schoolName;
		this.schoolPath = schoolPath;
		this.outputPath = outputPath;
		this.renderLabels = renderLabels;
		this.includeIsland = includeIsland;
		if(sort==1)Collections.sort(students, new EventReferenceSortComparator());
		else if(sort==2)Collections.sort(students, new EventImageNumberSortComparator());
		else if(sort==3)Collections.sort(students, new EventHomeroomSortComparator());
		this.plan = plan;
		this.render = render;
		horizTemp = new File(schoolPath+"\\Templates\\Horizontal.png");
		vertTemp  = new File(schoolPath+"\\Templates\\Vertical.png");
		if(horizTemp.exists() &&vertTemp.exists()) templates = true;
			
	}
	public void run()
	{
		try
		{
			bImage = new BufferedImage(3300, 5100, BufferedImage.TYPE_INT_RGB);
			bG = bImage.createGraphics();
			bG.setColor(Color.white);
			bG.fillRect(0, 0, 3300, 5100);
			cImage = new BufferedImage(1500, 2400, BufferedImage.TYPE_INT_RGB);
			cG = cImage.createGraphics();
			if(templates)
			{
				hImage = ImageIO.read(horizTemp);
				vImage = ImageIO.read(vertTemp);
			}
			if(plan==0) one5x7();		//Creates one 5x7 for every student
			else if(plan==1) count5x7();	//Creates 5x7s to match the number of orders
			else if(plan==2) wallet5x7();	//Creates Wallets to match the number of orders
			else if(plan==3)			//Package A 2-5x7s, Package B 1 Wallet, 1-5x7
			{
				cImage = new BufferedImage(1500, 5100, BufferedImage.TYPE_INT_RGB);
				cG = cImage.createGraphics();
				dance();
			}
			if(templates)
			{
				hImage.flush();
				vImage.flush();
				bImage.flush();
				cImage.flush();
			}
			if(renderLabels)
			{
				ArrayList<String> homeroomNames = new ArrayList<String>();
				for(EventStudent s:students)
				{
					if(Thread.currentThread().isInterrupted()) return;
					if(!homeroomNames.contains(s.homeroom)) homeroomNames.add(s.homeroom);
				}
				new RenderEventLabels(homeroomNames,outputPath,schoolName);
			}
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Card Creator: "+e);}
	}
	
	private void dance()
	{
		ArrayList<EventStudent> renderStudents = new ArrayList<EventStudent>();
		for(EventStudent s:students)
		{
			if(s.order.contains("."))
			{
				String[] t = s.order.split("\\.");
				for(String o:t)
				{
					if(o.equals("1")||o.equals("2"))
					{
						renderStudents.add(new EventStudent(s,o));
					}
				}
			}
			else if(s.order.equals("1")||s.order.equals("2"))
			{
				renderStudents.add(s);
			}
		}
		int stack = renderStudents.size()/2;
		if(renderStudents.size()%2!=0) stack++;
		//The total number of pages to be printed out
		int page=0,temp=0,total=0;
		render.printText("RenderStudents Size: "+renderStudents.size());
		render.printText("Stack Size: "+stack);
		try
		{
			for(page=0;page<stack;page++)
			{
				temp = page;
				if(temp<renderStudents.size())
				{
					total++;
					render.printText("Current: "+total+" Page: "+page+" Index: "+temp+" Student Ref: "+renderStudents.get(temp).ref+"\n");
					createDanceImage(renderStudents.get(temp));
					bG.drawImage(cImage, 1665, 0,null);
					render.updateProgressBar((total*100)/renderStudents.size());
				}
				temp = stack+page;
				if(temp<renderStudents.size())
				{
					total++;
					render.printText("Current: "+total+" Page: "+page+" Index: "+temp+" Student Ref: "+renderStudents.get(temp).ref+"\n");
					createDanceImage(renderStudents.get(temp));
					bG.drawImage(cImage, 135, 0,null);
					render.updateProgressBar((total*100)/renderStudents.size());
				}
				//Write Cards
				bG.setColor(Color.black);
				bG.setFont(new Font("Arial",Font.PLAIN,25));
				bG.drawString("Page_"+(stack-page), 3100, 5050);
				ImageIO.write(bImage,"jpg", new File(outputPath+"\\"+job.job+"_"+(stack-page)+".jpg"));
				
				//Write Cards
				bG.setColor(Color.white);
				bG.fillRect(0, 0, 3300, 5100);
			}
			render.printText("Complete");
		}
		catch(Exception e){render.printText("Error writing card: "+e+"\n On page: "+page+"\n");}
	}
	
	//Render 4 Wallets based on order count
	private void wallet5x7()
	{
		ArrayList<EventStudent> renderStudents = new ArrayList<EventStudent>();
		int orders = 0;
		for(EventStudent s:students)
		{
			try	{orders = Integer.parseInt(s.order);}catch(NumberFormatException e){orders = 0;}
			for(int i = 0;i<orders;i++)
			{
				s.order = (i+1)+" of "+orders;
				renderStudents.add(new EventStudent(s));
			}
		}
		int stack = renderStudents.size()/CARDSPERSHEET;
		if(renderStudents.size()%CARDSPERSHEET!=0) stack++;
		//The total number of pages to be printed out
		int page=0,temp=0,total=0;
		
		try
		{
			for(page=0;page<stack;page++)
			{
				for(int i=0;i<CARDSPERSHEET/2;i++)
				{
					temp = (i%2)+(page*2);
					if(temp<renderStudents.size())
					{
						total++;
						render.printText("Current: "+total+" Page: "+page+" YPos: "+i+" Index: "+temp+" Student Ref: "+renderStudents.get(temp).ref+"\n");
						createStudentWalletImage(renderStudents.get(temp));
						bG.drawImage(cImage, 1665, 135+(((i+1)%2)*2430),null);
						render.updateProgressBar((total*100)/renderStudents.size());
					}
					temp = (2*stack)+(i%2)+(page*2);
					if(temp<renderStudents.size())
					{
						total++;
						render.printText("Current: "+total+" Page: "+page+" YPos: "+i+" Index: "+temp+" Student Ref: "+renderStudents.get(temp).ref+"\n");
						createStudentWalletImage(renderStudents.get(temp));
						bG.drawImage(cImage, 135,135+(((i+1)%2)*2430),null);
						render.updateProgressBar((total*100)/renderStudents.size());
					}
				}
				//Write Cards
				bG.setColor(Color.black);
				bG.setFont(new Font("Arial",Font.PLAIN,25));
				bG.drawString("Page_"+(stack-page), 3100, 5050);

				ImageIO.write(bImage,"jpg", new File(outputPath+"\\"+job.job+"_"+(stack-page)+".jpg"));
				
				//Write Cards
				bG.setColor(Color.white);
				bG.fillRect(0, 0, 3300, 5100);

			}
			render.printText("Complete");
		}
		catch(Exception e){render.printText("Error writing card: "+e+"\n On page: "+page+"\n");}
	}
	//Render 5x7 for based on order count
	private void count5x7()
	{
		ArrayList<EventStudent> renderStudents = new ArrayList<EventStudent>();
		int orders = 0;
		for(EventStudent s:students)
		{
			try	{orders = Integer.parseInt(s.order);}catch(NumberFormatException e){orders = 0;}
			for(int i = 0;i<orders;i++)
			{
				s.order = (i+1)+" of "+orders;
				renderStudents.add(new EventStudent(s));
			}
		}
		int stack = renderStudents.size()/CARDSPERSHEET;
		if(renderStudents.size()%CARDSPERSHEET!=0) stack++;
		render.printText("Students: "+renderStudents.size()+" Stack: "+stack);
		//The total number of pages to be printed out
		int page=0,temp=0,total=0;
		
		try
		{
			for(page=0;page<stack;page++)
			{
				for(int i=0;i<CARDSPERSHEET/2;i++)
				{
					temp = (i%2)+(page*2);
					if(temp<renderStudents.size())
					{
						total++;
						render.printText("Current: "+total+" Page: "+page+" YPos: "+i+" Index: "+temp+" Student Ref: "+renderStudents.get(temp).ref+"\n");
						createStudentImage(renderStudents.get(temp));
						bG.drawImage(cImage, 1665, 135+(((i+1)%2)*2430),null);
						render.updateProgressBar((total*100)/renderStudents.size());
					}
					temp = (2*stack)+(i%2)+(page*2);
					if(temp<renderStudents.size())
					{
						total++;
						render.printText("Current: "+total+" Page: "+page+" YPos: "+i+" Index: "+temp+" Student Ref: "+renderStudents.get(temp).ref+"\n");
						createStudentImage(renderStudents.get(temp));
						bG.drawImage(cImage, 135,135+(((i+1)%2)*2430),null);
						render.updateProgressBar((total*100)/renderStudents.size());
					}
				}
				//Write Cards
				bG.setColor(Color.black);
				bG.setFont(new Font("Arial",Font.PLAIN,25));
				bG.drawString("Page_"+(stack-page), 3100, 5050);
				
				ImageIO.write(bImage,"jpg", new File(outputPath+"\\"+job.job+"_"+(stack-page)+".jpg"));
				
				//Write Cards
				bG.setColor(Color.white);
				bG.fillRect(0, 0, 3300, 5100);

			}
			render.printText("Complete");
		}
		catch(Exception e){render.printText("Error writing card: "+e+"\n On page: "+page+"\n");}
		
	}
	//Render 1-5x7 for Each
	private void one5x7()
	{
		
		//The total number of pages to be printed out
		int stack = students.size()/CARDSPERSHEET;
		if(students.size()%CARDSPERSHEET!=0) stack++;
		render.printText("Package Plan: 1-5x7 for each image");
		render.printText("Total Sheets: "+stack+": TotalStudents: "+students.size()+"\n");
		int page=0,temp=0,total=0;
		
		try
		{
			for(page=0;page<stack;page++)
			{
				for(int i=0;i<CARDSPERSHEET/2;i++)
				{
					temp = (i%2)+(page*2);
					if(temp<students.size())
					{
						total++;
						render.printText("Current: "+total+" Page: "+page+" YPos: "+i+" Index: "+temp+" Student Ref: "+students.get(temp).ref+"\n");
						createStudentImage(students.get(temp));
						bG.drawImage(cImage, 1665, 135+(((i+1)%2)*2430),null);
						render.updateProgressBar((total*100)/students.size());
					}
					temp = (2*stack)+(i%2)+(page*2);
					if(temp<students.size())
					{
						total++;
						render.printText("Current: "+total+" Page: "+page+" YPos: "+i+" Index: "+temp+" Student Ref: "+students.get(temp).ref+"\n");
						createStudentImage(students.get(temp));
						bG.drawImage(cImage, 135,135+(((i+1)%2)*2430),null);
						render.updateProgressBar((total*100)/students.size());
					}
				}
				//Write Cards
				bG.setColor(Color.black);
				bG.setFont(new Font("Arial",Font.PLAIN,25));
				bG.drawString("Page_"+(stack-page), 3100, 5050);

				ImageIO.write(bImage,"jpg", new File(outputPath+"\\"+job.job+"_"+(stack-page)+".jpg"));
				
				//Write Cards
				bG.setColor(Color.white);
				bG.fillRect(0, 0, 3300, 5100);

			}
			render.printText("Complete");
		}
		catch(Exception e){render.printText("Error writing card: "+e+"\n On page: "+page+"\n");}
		
	}
	
	private void createStudentImage(EventStudent s)
	{
		try
		{
			cG.setColor(Color.white);
			cG.fillRect(0, 0, 1500,2400);
			File stuFile = new File(schoolPath+"\\Images\\"+s.image);
			if(stuFile.exists())
			{
				BufferedImage stuImg = ImageIO.read(stuFile);
				
				int width, height;
				double diff;
				
				if(stuImg.getWidth()>stuImg.getHeight())
				{
					stuImg = rotate(stuImg);
					horizontal = true;
				}

				width = stuImg.getWidth();
				height = stuImg.getHeight();
				
				diff = (height - (width*1.4))/2;
				if(diff>=0)	stuImg = stuImg.getSubimage(0, (int)diff, width, (int)(width*1.4));
				else
				{
					diff = (width -(height*.71428))/2;
					stuImg = stuImg.getSubimage((int)diff, 0, (int)(height*.71428), height);
				}

				cG.drawImage(stuImg.getScaledInstance(1500, -1, Image.SCALE_SMOOTH),0,0,null);
				
				if(templates)
				{
					if(horizontal) cG.drawImage(hImage, 0, 0, null);
					else cG.drawImage(vImage, 0, 0, null);
				}
				
				
				stuImg.flush();
				horizontal = false;
			}

			cG.setColor(Color.black);
			cG.setFont(new Font("Arial",Font.PLAIN,50));
			cG.drawString(s.ref+":  "+s.image+"   Count: "+s.order, 30, 2180);
			cG.drawString(s.homeroom+": "+s.last+", "+s.first, 30, 2240);
			if(includeIsland)
			{
				cG.drawString("Island Photography \u00a92025-2026:  559-456-1400", 30,2290);
			}

			
			
		}catch(Exception e){render.printText("Error: "+s.ref+" "+e);}

		
	}
	private void createStudentWalletImage(EventStudent s)
	{
		try
		{
			cG.setColor(Color.white);
			cG.fillRect(0, 0, 1500,2400);
			File stuFile = new File(schoolPath+"\\Images\\"+s.image);
			if(stuFile.exists())
			{
				BufferedImage stuImg = ImageIO.read(stuFile);
				BufferedImage tempImg = new BufferedImage(1500, 2100, BufferedImage.TYPE_INT_RGB);
				Graphics2D tG = tempImg.createGraphics();
				
				int width, height;
				double diff;
				
				if(stuImg.getWidth()>stuImg.getHeight())
				{
					stuImg = rotate(stuImg);
					horizontal = true;
				}

				width = stuImg.getWidth();
				height = stuImg.getHeight();
				
				diff = (height - (width*1.4))/2;
					
				stuImg = stuImg.getSubimage(0, (int)diff, width, (int)(width*1.4));
				tG.drawImage(stuImg.getScaledInstance(1500, -1, Image.SCALE_SMOOTH),0,0,null);
				if(templates)
				{
					if(horizontal) tG.drawImage(hImage, 0, 0, null);
					else tG.drawImage(vImage, 0, 0, null);
				}
				Image temp = tempImg.getScaledInstance(750, -1, Image.SCALE_SMOOTH);
				cG.drawImage(temp, 0,0,null);
				cG.drawImage(temp, 751,0,null);
				cG.drawImage(temp, 0,1051,null);
				cG.drawImage(temp, 751,1051,null);
				
				tempImg.flush();
				stuImg.flush();
				temp.flush();
				horizontal = false;
			}

			cG.setColor(Color.black);
			cG.setFont(new Font("Arial",Font.PLAIN,50));
			cG.drawString(s.ref+":  "+s.image+"   Count: "+s.order, 30, 2180);
			cG.drawString(s.homeroom+": "+s.last+", "+s.first, 30, 2240);
			cG.drawString("Island Photography \u00a92025-2026:  559-456-1400", 30,2290);
			
			
		}catch(Exception e){render.printText("Error: "+s.ref+" "+e);}

		
	}
	private void createDanceImage(EventStudent s)
	{
		try
		{
			cG.setColor(Color.white);
			cG.fillRect(0, 0, 1500,5100);
			cG.setColor(Color.black);
			cG.setFont(new Font("Arial",Font.PLAIN,50));
			File stuFile = new File(schoolPath+"\\Images\\"+s.image);
			if(stuFile.exists())
			{
				BufferedImage stuImg = ImageIO.read(stuFile);
				BufferedImage tempImg = new BufferedImage(1500, 2100, BufferedImage.TYPE_INT_RGB);
				Graphics2D tG = tempImg.createGraphics();
				
				int width, height;
				double diff;
				
				if(stuImg.getWidth()>stuImg.getHeight())
				{
					stuImg = rotate(stuImg);
					horizontal = true;
				}

				width = stuImg.getWidth();
				height = stuImg.getHeight();
				
				diff = (height - (width*1.4))/2;
					
				stuImg = stuImg.getSubimage(0, (int)diff, width, (int)(width*1.4));
				tG.drawImage(stuImg.getScaledInstance(1500, -1, Image.SCALE_SMOOTH),0,0,null);
				if(templates)
				{
					if(horizontal) tG.drawImage(hImage, 0, 0, null);
					else tG.drawImage(vImage, 0, 0, null);
				}
				//2-5x7s
				if(s.order.equals("1"))
				{
					cG.drawImage(tempImg, 0, 135, null);
					cG.drawString(s.ref+":  "+s.image+"   2 of 2 5x7's", 30, 135+2180);
					cG.drawString(s.homeroom+": "+s.last+", "+s.first, 30, 135+2240);
					cG.drawString("Island Photography \u00a92025-2026:  559-456-1400", 30,135+2290);
					
					cG.drawImage(tempImg, 0, 135+2430, null);
					cG.drawString(s.ref+":  "+s.image+"   1 of 2 5x7's", 30, 135+2430+2180);
					cG.drawString(s.homeroom+": "+s.last+", "+s.first, 30, 135+2430+2240);
					cG.drawString("Island Photography \u00a92025-2026:  559-456-1400", 30,135+2430+2290);
					
				}
				//1-5x7, 4Wallets
				else if(s.order.equals("2"))
				{
					Image temp = tempImg.getScaledInstance(750, -1, Image.SCALE_SMOOTH);
					cG.drawImage(temp, 0,135,null);
					cG.drawImage(temp, 751,135,null);
					cG.drawImage(temp, 0,135+1051,null);
					cG.drawImage(temp, 751,135+1051,null);
					cG.drawString(s.ref+":  "+s.image+"   4 Wallets", 30, 135+2180);
					cG.drawString(s.homeroom+": "+s.last+", "+s.first, 30, 135+2240);
					cG.drawString("Island Photography \u00a92025-2026:  559-456-1400", 30,135+2290);
					
					cG.drawImage(tempImg, 0, 135+2430, null);
					cG.drawString(s.ref+":  "+s.image+"   1-5x7", 30, 135+2430+2180);
					cG.drawString(s.homeroom+": "+s.last+", "+s.first, 30, 135+2430+2240);
					cG.drawString("Island Photography \u00a92025-2026:  559-456-1400", 30,135+2430+2290);
					temp.flush();
				}				tempImg.flush();
				stuImg.flush();
				
				horizontal = false;
			}
		}catch(Exception e){render.printText("Error: "+s.ref+" "+e);}
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
