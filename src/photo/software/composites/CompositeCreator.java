package photo.software.composites;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import photo.software.comparators.StudentClassSortComparator;
import photo.software.student.Student;

public class CompositeCreator implements Runnable
{
	private ArrayList<Homeroom> homerooms;
	private String outputPath, year, schoolName,principal,imgPath;
	private Boolean onlyPhotographed, schoolText;
	private File stuImgFile;
	int textXMax;
	private Color schoolInfoColor, stuNameC, facNameC;
	
	private BufferedImage bImage, background, stuImage, star456, star547, star672;
	private Graphics2D bG;
	CompositeGUI gui;
	public CompositeCreator(CompositeGUI gui, ArrayList<Student> students, ArrayList<Student> staffAdd, String schoolPath, String outputPath,
			boolean schoolText, boolean onlyPhotographed, String schoolName, String principal, String schoolYear, String maxX)
	{
		this.gui = gui;
		homerooms = new ArrayList<Homeroom>();
		Collections.sort(students, new StudentClassSortComparator());
		for(Student s:students)
		{
			if((!s.homeroom.equals(""))
					&&(!s.last.equals(""))
					&&(!s.first.equals(""))
					&&(!s.grade.equals("EXMPT"))
					&&(s.photo.toUpperCase().equals("TRUE"))) addToHomeroom(s);
		}
		sortTeachers();
		addFaculty(staffAdd);
		imgPath = schoolPath+"\\CroppedMed\\";
		this.outputPath = outputPath;
		this.schoolText = schoolText;
		this.onlyPhotographed = onlyPhotographed;
		this.schoolName = schoolName;
		this.principal = principal;
		this.year = schoolYear;
		
		try{textXMax = Integer.parseInt(maxX);}
		catch(Exception e){textXMax = 1350;JOptionPane.showMessageDialog(null, "Invalid Max");}
		
		
		stuNameC = Color.black;
		facNameC = Color.black;
		schoolInfoColor = Color.white;
	}
	
	
	public void buildStarStudent(ArrayList<Student> starStudents)
	{
		int count = 1;
		String errorNote ="";
		try
		{
			star456 = ImageIO.read(new File("Templates\\Star_456.png"));
			star547 = ImageIO.read(new File("Templates\\Star_547.png"));
			star672 = ImageIO.read(new File("Templates\\Star_672.png"));
			for(Homeroom h:homerooms)
			{
				errorNote = h.getHomeroom();
				background = ImageIO.read(new File(outputPath+"\\_STAR_"+h.getHomeroom()+".jpg"));
				errorNote+=" HOMEROOM READ";
				for(Student s:starStudents)
				{
					errorNote = s.ref;
					bImage = new BufferedImage(3150,2400,BufferedImage.TYPE_INT_RGB);
					bG = bImage.createGraphics();
					bG.setColor(Color.white);
					bG.fillRect(0,  0, 3150, 2400);

					bG.drawImage(background, 150, 0, null);
					stuImgFile = new File(imgPath+s.ref+".jpg");
										
					if(h.getHomeroom().equals(s.homeroom)&&stuImgFile.exists())
					{
						errorNote+="Img Exists";
						stuImage = ImageIO.read(stuImgFile);
						errorNote+="Read "+h.totalStudents();
						bG.setFont(new Font("Myriad Pro",Font.PLAIN,65));
						bG.setColor(stuNameC);
					
						int shiftLeft=150;
						if(h.totalStudents()<21)//Done
						{
							bG.setColor(Color.white);
							bG.fillRect(shiftLeft+194, 485, 692, 860);
							bG.drawImage(stuImage.getScaledInstance(672, -1, Image.SCALE_SMOOTH), shiftLeft+204, 495, null);
							bG.drawImage(star672, shiftLeft+204, 495, null);
							bG.setColor(Color.black);
							printSimpleString(s.first+" "+s.last,712,shiftLeft+184,1393);
						}
						else if(h.totalStudents()<25)
						{
							bG.setColor(Color.white);
							bG.fillRect(shiftLeft+119, 485, 692, 860);
							bG.drawImage(stuImage.getScaledInstance(672, -1, Image.SCALE_SMOOTH), shiftLeft+129, 495, null);
							bG.drawImage(star672, shiftLeft+129, 495, null);
							bG.setColor(Color.black);
							printSimpleString(s.first+" "+s.last,712,shiftLeft+109,1393);
						}
						else if(h.totalStudents()<32) //Done!
						{
							bG.setColor(Color.white);
							bG.fillRect(shiftLeft+181, 406, 567, 704);
							bG.drawImage(stuImage.getScaledInstance(547, -1, Image.SCALE_SMOOTH), shiftLeft+191, 416, null);
							bG.drawImage(star547, shiftLeft+191, 416, null);
							bG.setColor(Color.black);
							printSimpleString(s.first+" "+s.last,587,shiftLeft+171,1163);
						}
						else if(h.totalStudents()<37) //Done!!
						{
							bG.setColor(Color.white);
							bG.fillRect(shiftLeft+128, 406, 567, 704);
							bG.drawImage(stuImage.getScaledInstance(547, -1, Image.SCALE_SMOOTH), shiftLeft+138, 416, null);
							bG.drawImage(star547, shiftLeft+138, 416, null);
							bG.setColor(Color.black);
							printSimpleString(s.first+" "+s.last,587,shiftLeft+118,1163);
						}
						else if(h.totalStudents()<45)
						{
							bG.setColor(Color.white);
							bG.fillRect(shiftLeft+192, 363, 476, 590);
							bG.drawImage(stuImage.getScaledInstance(456, -1, Image.SCALE_SMOOTH), shiftLeft+202, 373, null);
							bG.drawImage(star456, shiftLeft+202, 373, null);
							bG.setColor(Color.black);
							bG.setFont(new Font("Myriad Pro",Font.PLAIN,45));
							bG.setColor(stuNameC);
							printSimpleString(s.first+" "+s.last,496,shiftLeft+182,1001);
						}
						
						bG.setFont(new Font("Arial",Font.PLAIN,50));
						//Old settings for name on left was 270R, -2100,3100, 90R
						bG.setTransform(AffineTransform.getRotateInstance(Math.toRadians(90)));
						bG.drawString(s.homeroom+": "+s.last+", "+s.first, 450, -50);
						bG.setTransform(AffineTransform.getRotateInstance(Math.toRadians(270)));
						
						ImageIO.write(bImage, "jpg", new File(outputPath+"\\StudentComposites\\"+h.getHomeroom()+"_"+s.last+"_"+s.first+"_"+count+"s.jpg"));
						count++;
					}
					bImage.flush();
					bImage = null;
				}
				background.flush();
				background = null;
				
			}
			star456.flush();
			star456 = null;
			star547.flush();
			star547 = null;
			star672.flush();
			star672 = null;
			
		}catch(Exception e){JOptionPane.showMessageDialog(null,"ErrorBuildingStar: "+errorNote+". "+e);}
	}
	private void sortTeachers()
	{
		for(Homeroom h:homerooms)
		{
			h.sortTeachers();
		}
	}
	private void addToHomeroom(Student s)
	{
		Boolean exists = false;
		for(Homeroom h: homerooms)
		{
			if(h.getHomeroom().equals(s.homeroom))
			{
				exists = true;
				h.addStudent(s);
				return;
			}
		}if(!exists)
		{
			homerooms.add(new Homeroom(s.homeroom));
			for(Homeroom h:homerooms)
			{
				if(h.getHomeroom().equals(s.homeroom)) h.addStudent(s);
			}
		}
	}
	private void addFaculty(ArrayList<Student> staffAdd)
	{
		for(Homeroom h:homerooms)
		{
			for(Student f: staffAdd) h.addStudent(f);
		}
	}
	public void run()
	{
		for(int i=0;i<homerooms.size();i++)
		{
			if(Thread.currentThread().isInterrupted()) return;
			build(homerooms.get(i));
			gui.updateProgressBar(((i+1)*100)/homerooms.size());
		}
	}
	public void build(String homeroomName)
	{
		for(Homeroom h:homerooms)
		{
			if(homeroomName.equals(h.getHomeroom()))
			{
				build(h);
				break;
			}
		}
	}
	public void build(Homeroom h)
	{
		String grade="",teacher="";
		ArrayList<Student> stu = new ArrayList<Student>();
		ArrayList<Student> teach = new ArrayList<Student>();
		try
		{
			try
			{
				bImage = ImageIO.read(new File("Templates\\CompositeBackground.jpg"));
			}catch(Exception e)
			{
				bImage = new BufferedImage(3000,2400,BufferedImage.TYPE_INT_RGB);
			}
			bG = bImage.createGraphics();
			if(onlyPhotographed) stu = h.getPhotographedStudents();
			else stu = h.getStudents();
			teach = h.getTeachers();
			
			teacher = h.getTeacher();
			grade = h.getGrade();
			
			if(stu.size()<25)
			{
				for(int i=0;i<stu.size();i++) write24(stu.get(i),i);
				if(teach.size()<4) for(int i=0;i<teach.size();i++) fac24(teach.get(i),i);
				else for(int i=0;i<teach.size();i++) facReduce(teach.get(i),i,20);
			}
			else if(stu.size()<29)
			{
				for(int i=0;i<stu.size();i++) write28(stu.get(i),i);
				if(teach.size()<4) for(int i=0;i<teach.size();i++) fac28(teach.get(i),i);
				else for(int i=0;i<teach.size();i++) facReduce(teach.get(i),i,25);
			}
			else if(stu.size()<36)
			{
				for(int i=0;i<stu.size();i++) write35(stu.get(i),i);
				if(teach.size()<4) for(int i=0;i<teach.size();i++) fac35(teach.get(i),i);
				else for(int i=0;i<teach.size();i++) facReduce(teach.get(i),i,0);
			}
			else if(stu.size()<41)
			{
				for(int i=0;i<stu.size();i++) write40(stu.get(i),i);
				for(int i=0;i<teach.size();i++) fac40(teach.get(i),i);
			}	
			if(schoolText)
			{
				//School Name
				bG.setColor(schoolInfoColor);
				bG.setFont(new Font("Myriad Pro",Font.PLAIN,130));
				printLeftSimpleString(schoolName, textXMax-110,110,130);
				//HR Info
				bG.setFont(new Font("Myriad Pro",Font.PLAIN,40));
				printLeftSimpleString(principal,1240,110,175);
				
				bG.setFont(new Font("Myriad Pro",Font.BOLD,65));
				printLeftSimpleString(teacher,900, 110, 255);
				
				bG.setFont(new Font("Myriad Pro",Font.BOLD,50));
				printLeftSimpleString(grade, 750,110,305);
				
				bG.setFont(new Font("Myriad Pro",Font.PLAIN,40));
				printLeftSimpleString(year, 750,110,355);
			}
			
			
		ImageIO.write(bImage, "jpg", new File(outputPath+"\\"+h.getHomeroom()+".jpg"));
		bImage.flush();
		bImage = null;
		
		
		////////Star/////////
		try
		{
			bImage = ImageIO.read(new File("Templates\\CompositeBackground.jpg"));
		}catch(Exception e)
		{
			bImage = new BufferedImage(3000,2400,BufferedImage.TYPE_INT_RGB);
		}
		bG = bImage.createGraphics();
		
		if(stu.size()<21)
		{
			for(int i=0;i<stu.size();i++) writeStar20(stu.get(i),i);
			if(teach.size()<4) for(int i=0;i<teach.size();i++) fac24(teach.get(i),i);
			else for(int i=0;i<teach.size();i++) facReduce(teach.get(i),i,0);	
		}
		else if(stu.size()<25)
		{
			for(int i=0;i<stu.size();i++) writeStar24(stu.get(i),i);
			for(int i=0;i<teach.size();i++) fac28(teach.get(i),i);
		}
		else if(stu.size()<32)
		{
			for(int i=0;i<stu.size();i++) writeStar31(stu.get(i),i);
			for(int i=0;i<teach.size();i++) fac35(teach.get(i),i);
		}
		else if(stu.size()<37)
		{
			for(int i=0;i<stu.size();i++) writeStar36(stu.get(i),i);
			for(int i=0;i<teach.size();i++) fac40(teach.get(i),i);
		}
		else if(stu.size()<42)
		{
			for(int i=0;i<stu.size();i++) writeStar44(stu.get(i),i);
			for(int i=0;i<teach.size();i++) fac48(teach.get(i),i);
		}
		if(schoolText)
		{
			//School Name
			bG.setColor(schoolInfoColor);
			bG.setFont(new Font("Myriad Pro",Font.PLAIN,130));
			printLeftSimpleString(schoolName, textXMax-110,110,130);
			//HR Info
			bG.setFont(new Font("Myriad Pro",Font.PLAIN,40));
			printLeftSimpleString(principal,1240,110,175);
			
			bG.setFont(new Font("Myriad Pro",Font.BOLD,65));
			printLeftSimpleString(teacher,900, 110, 255);
			
			bG.setFont(new Font("Myriad Pro",Font.BOLD,50));
			printLeftSimpleString(grade, 750,110,305);
			
			bG.setFont(new Font("Myriad Pro",Font.PLAIN,40));
			printLeftSimpleString(year, 750,110,355);
		}

		ImageIO.write(bImage, "jpg", new File(outputPath+"\\_STAR_"+h.getHomeroom()+".jpg"));
		bImage.flush();
		bImage=null;
				
		bG.dispose();
		System.gc();
				
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error: "+e);}
	}

	
	private void write24(Student s, int index)	//Done!
	{
		int row[] = {25,495,965,1435,1905};			//5 Rows
		int col[] = {60,540,1020,1500,1980,2460};	//6 Columns
		block24(s,col[index%6],row[(index/6)+1]);
	}
	private void write28(Student s, int index)	//Done!
	{
		int row[] = {25,495,965,1435,1905};				//5 Rows
		int col[] = {50,465,880,1295,1710,2125,2540};	//7 Columns
		block28(s,col[index%7],row[(index/7)+1]);
	}
	private void write35(Student s, int index)	//Done!
	{
		int row[] = {24,416,808,1200,1592,1984};		//6 Rows
		int col[] = {50,465,880,1295,1710,2125,2540};	//7 Columns
		block35(s,col[index%7],row[(index/7)+1]);
	}
	private void write40(Student s, int index)	//Done!
	{
		int row[] = {24,416,808,1200,1592,1984};			//6 Rows
		int col[] = {48,411,774,1137,1500,1863,2226,2589};	//8 Columns
		block40(s,col[index%8],row[(index/8)+1]);
	}

	
	private void block24(Student s, int x, int y)//Done!
	{
		try
		{
			stuImgFile = new File(imgPath+s.ref+".jpg");
			if(stuImgFile.exists())
			{
				bG.setColor(Color.black);
				bG.fillRect(x+68, y-4, 344, 428);
				stuImage = ImageIO.read(stuImgFile);
				bG.drawImage(stuImage.getScaledInstance(336,-1,Image.SCALE_SMOOTH), x+72, y+0, null);
				stuImage.flush();
				stuImage = null;
			}
			bG.setFont(new Font("Arial", Font.BOLD,30));
			writeOutlineText(s.first+" "+s.last, 440, x+20, y+450, Color.white, stuNameC);
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Student createBlock24 error: "+s.ref+" "+e);}
	}
	private void block28(Student s, int x, int y)//Done!
	{
		try
		{
			stuImgFile = new File(imgPath+s.ref+".jpg");
			if(stuImgFile.exists())
			{
				bG.setColor(Color.black);
				bG.fillRect(x+36, y-4, 344, 428);
				stuImage = ImageIO.read(stuImgFile);
				bG.drawImage(stuImage.getScaledInstance(336,-1,Image.SCALE_SMOOTH), x+40,y+0,null);
				stuImage.flush();
				stuImage=null;
			}
			bG.setFont(new Font("Arial", Font.BOLD,30));
			writeOutlineText(s.first+" "+s.last, 375, x+20, y+450, Color.white, stuNameC);
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Student createBlock28 error: "+s.ref+" "+e);}
	}
	private void block35(Student s, int x, int y)//Done!
	{
		try
		{
			stuImgFile = new File(imgPath+s.ref+".jpg");
			if(stuImgFile.exists())
			{
				bG.setColor(Color.black);
				bG.fillRect(x+66,y-4,282,350);
				stuImage = ImageIO.read(stuImgFile);
				bG.drawImage(stuImage.getScaledInstance(274,-1,Image.SCALE_SMOOTH), x+70, y+0, null);
				stuImage.flush();
				stuImage=null;
			}
			bG.setFont(new Font("Arial", Font.BOLD,30));
			writeOutlineText(s.first+" "+s.last, 375, x+20, y+372, Color.white, stuNameC);
			
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Student createBlock35 error: "+s.ref+" "+e);}
	}
	private void block40(Student s, int x, int y)//Done!
	{
		try
		{
			stuImgFile = new File(imgPath+s.ref+".jpg");
			if(stuImgFile.exists())
			{
				bG.setColor(Color.black);
				bG.fillRect(x+41,y-4,282,350);
				stuImage = ImageIO.read(stuImgFile);
				bG.drawImage(stuImage.getScaledInstance(274,-1,Image.SCALE_SMOOTH), x+45, y+0, null);
				stuImage.flush();
				stuImage=null;
			}
			bG.setFont(new Font("Arial", Font.BOLD,30));
			writeOutlineText(s.first+" "+s.last, 320, x+21, y+372, Color.white, stuNameC);
			
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Student createBlock40 error: "+s.ref+" "+e);}
	}
	private void block48(Student s, int x, int y)//Done!
	{
		try
		{
			stuImgFile = new File(imgPath+s.ref+".jpg");
			if(stuImgFile.exists())
			{
				bG.setColor(Color.black);
				bG.fillRect(x+65,y-4,236,293);
				stuImage = ImageIO.read(stuImgFile);
				bG.drawImage(stuImage.getScaledInstance(228,-1,Image.SCALE_SMOOTH), x+69, y+0, null);
				stuImage.flush();
				stuImage=null;
			}
			bG.setFont(new Font("Arial", Font.BOLD,30));
			writeOutlineText(s.first+" "+s.last, 330, x+21, y+315, Color.white, stuNameC);
			
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Student createBlock48 error: "+s.ref+" "+e);}
	}

	private void fac24(Student s, int index)
	{
		int row[] = {25,495,965,1435,1905};			//5 Rows
		int col[] = {60,540,1020,1500,1980,2460};	//6 Columns
		try
		{
			stuImgFile = new File(imgPath+s.ref+".jpg");
			if(stuImgFile.exists())
			{
				bG.setColor(Color.black);
				bG.fillRect(col[5-index]+68, row[0]-4, 344, 428);
				stuImage = ImageIO.read(stuImgFile);
				bG.drawImage(stuImage.getScaledInstance(336,-1,Image.SCALE_SMOOTH), col[5-index]+72, row[0]+0, null);
				stuImage.flush();
				stuImage=null;
			}
			bG.setFont(new Font("Arial", Font.BOLD,30));
			writeOutlineText(s.first+" "+s.last, 440,col[5-index]+20,row[0]+450, Color.white, facNameC);
		
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Fac CreateBlock 24 Error: "+s.ref+" "+e);}
	}
	private void fac28(Student s, int index)
	{
		int row[] = {25,495,965,1435,1905};				//5 Rows
		int col[] = {50,465,880,1295,1710,2125,2540};	//7 Columns
		try
		{
			stuImgFile = new File(imgPath+s.ref+".jpg");
			if(stuImgFile.exists())
			{
				bG.setColor(Color.black);
				bG.fillRect(col[6-index]+36, row[0]-4, 344, 428);
				stuImage = ImageIO.read(stuImgFile);
				bG.drawImage(stuImage.getScaledInstance(336,-1,Image.SCALE_SMOOTH), col[6-index]+40, row[0]+0, null);
				stuImage.flush();
				stuImage=null;
			}
			bG.setFont(new Font("Arial", Font.BOLD,30));
			writeOutlineText(s.first+" "+s.last, 375,col[6-index]+20,row[0]+450, Color.white, facNameC);
		
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Fac CreateBlock 28 Error: "+s.ref+" "+e);}
	}
	private void fac35(Student s, int index)
	{
		int row[] = {24,416,808,1200,1592,1984};		//6 Rows
		int col[] = {50,465,880,1295,1710,2125,2540};	//7 Columns
		try
		{		
			stuImgFile = new File(imgPath+s.ref+".jpg");
			if(stuImgFile.exists())
			{
				bG.setColor(Color.black);
				bG.fillRect(col[6-index]+66, row[0]-4, 282, 350);
				stuImage = ImageIO.read(stuImgFile);
				bG.drawImage(stuImage.getScaledInstance(274,-1,Image.SCALE_SMOOTH), col[6-index]+70, row[0]+0, null);
				stuImage.flush();
				stuImage=null;
			}
			bG.setFont(new Font("Arial", Font.BOLD,30));
			writeOutlineText(s.first+" "+s.last, 375,col[6-index]+20,row[0]+372, Color.white, facNameC);

		}catch(Exception e){JOptionPane.showMessageDialog(null,"Fac createBlock 35 error: "+s.ref+" "+e);}
	}
	private void fac40(Student s, int index)
	{
		int row[] = {24,416,808,1200,1592,1984};			//6 Rows
		int col[] = {48,411,774,1137,1500,1863,2226,2589};	//8 Columns
		try
		{		
			stuImgFile = new File(imgPath+s.ref+".jpg");
			if(stuImgFile.exists())
			{
				bG.setColor(Color.black);
				bG.fillRect(col[7-index]+41, row[0]-4, 282, 350);
				stuImage = ImageIO.read(stuImgFile);
				bG.drawImage(stuImage.getScaledInstance(274,-1,Image.SCALE_SMOOTH), col[7-index]+45, row[0]+0, null);
				stuImage.flush();
				stuImage=null;
			}
			bG.setFont(new Font("Arial", Font.BOLD,30));
			writeOutlineText(s.first+" "+s.last, 320,col[7-index]+21,row[0]+372, Color.white, facNameC);
		
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Fac createBlock 40 error: "+s.ref+" "+e);}
	}
	private void fac48(Student s, int index)
	{
		int row[] = {23,358,693,1028,1363,1698,2033};		//7 Rows
		int col[] = {40,405,770,1135,1500,1865,2230,2595};	//8 Columns
		try
		{		
			stuImgFile = new File(imgPath+s.ref+".jpg");
			if(stuImgFile.exists())
			{
				bG.setColor(Color.black);
				bG.fillRect(col[7-index]+65, row[0]-4, 236, 293);
				stuImage = ImageIO.read(stuImgFile);
				bG.drawImage(stuImage.getScaledInstance(228,-1,Image.SCALE_SMOOTH), col[7-index]+69, row[0]+0, null);
				stuImage.flush();
				stuImage=null;
			}
			bG.setFont(new Font("Arial", Font.BOLD,30));
			writeOutlineText(s.first+" "+s.last, 330,col[7-index]+21,row[0]+315, Color.white, facNameC);
		
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Fac createBlock 40 error: "+s.ref+" "+e);}
	}
	private void facReduce(Student s, int index, int addToY)
	{
		int row[] = {24,416,808,1200,1592,1984};			//6 Rows
		int col[] = {48,411,774,1137,1500,1863,2226,2589};	//8 Columns
		try
		{		
			stuImgFile = new File(imgPath+s.ref+".jpg");
			if(stuImgFile.exists())
			{
				bG.setColor(Color.black);
				bG.fillRect(col[7-index]+41, row[0]-4+addToY, 282, 350);
				stuImage = ImageIO.read(stuImgFile);
				bG.drawImage(stuImage.getScaledInstance(274,-1,Image.SCALE_SMOOTH), col[7-index]+45, row[0]+0+addToY, null);
				stuImage.flush();
				stuImage=null;
			}
			bG.setFont(new Font("Arial", Font.BOLD,30));
			writeOutlineText(s.first+" "+s.last, 320,col[7-index]+21,row[0]+372+addToY, Color.white, facNameC);
		
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Fac createBlockFacReduce error: "+s.ref+" "+e);}
	}
	
	private void writeStar20(Student s, int index)
	{
		int row[] = {25,495,965,1435,1905};			//5 Rows
		int col[] = {60,540,1020,1500,1980,2460};	//6 Columns
		
		if(index%20==0) block24(s,col[2],row[1]);
		else if(index%20==1) block24(s, col[3],row[1]);
		else if(index%20==2) block24(s, col[4],row[1]);
		else if(index%20==3) block24(s, col[5],row[1]);
		else if(index%20==4) block24(s, col[2],row[2]);
		else if(index%20==5) block24(s, col[3],row[2]);
		else if(index%20==6) block24(s, col[4],row[2]);
		else if(index%20==7) block24(s, col[5],row[2]);
		else if(index%20==8) block24(s, col[0],row[3]);
		else if(index%20==9) block24(s, col[1],row[3]);
		else if(index%20==10) block24(s, col[2],row[3]);
		else if(index%20==11) block24(s, col[3],row[3]);
		else if(index%20==12) block24(s, col[4],row[3]);
		else if(index%20==13) block24(s, col[5],row[3]);
		else if(index%20==14) block24(s, col[0],row[4]);
		else if(index%20==15) block24(s, col[1],row[4]);
		else if(index%20==16) block24(s, col[2],row[4]);
		else if(index%20==17) block24(s, col[3],row[4]);
		else if(index%20==18) block24(s, col[4],row[4]);
		else if(index%20==19) block24(s, col[5],row[4]);
	}
	private void writeStar24(Student s, int index)
	{
		int row[] = {25,495,965,1435,1905};				//5 Rows
		int col[] = {50,465,880,1295,1710,2125,2540};	//7 Columns
		
		if(index%24==0) block28(s,col[2],row[1]);
		else if(index%24==1) block28(s,col[3],row[1]);
		else if(index%24==2) block28(s,col[4],row[1]);
		else if(index%24==3) block28(s,col[5],row[1]);
		else if(index%24==4) block28(s,col[6],row[1]);
		else if(index%24==5) block28(s,col[2],row[2]);
		else if(index%24==6) block28(s,col[3],row[2]);
		else if(index%24==7) block28(s,col[4],row[2]);
		else if(index%24==8) block28(s,col[5],row[2]);
		else if(index%24==9) block28(s,col[6],row[2]);
		else if(index%24==10) block28(s,col[0],row[3]);
		else if(index%24==11) block28(s,col[1],row[3]);
		else if(index%24==12) block28(s,col[2],row[3]);
		else if(index%24==13) block28(s,col[3],row[3]);
		else if(index%24==14) block28(s,col[4],row[3]);
		else if(index%24==15) block28(s,col[5],row[3]);
		else if(index%24==16) block28(s,col[6],row[3]);
		else if(index%24==17) block28(s,col[0],row[4]);
		else if(index%24==18) block28(s,col[1],row[4]);
		else if(index%24==19) block28(s,col[2],row[4]);
		else if(index%24==20) block28(s,col[3],row[4]);
		else if(index%24==21) block28(s,col[4],row[4]);
		else if(index%24==22) block28(s,col[5],row[4]);
		else if(index%24==23) block28(s,col[6],row[4]);
	}
	private void writeStar31(Student s, int index)
	{
		int row[] = {24,416,808,1200,1592,1984};		//6 Rows
		int col[] = {50,465,880,1295,1710,2125,2540};	//7 Columns
		
		if(index%31==0) block35(s,col[2],row[1]);
		else if(index%31==1) block35(s,col[3],row[1]);
		else if(index%31==2) block35(s,col[4],row[1]);
		else if(index%31==3) block35(s,col[5],row[1]);
		else if(index%31==4) block35(s,col[6],row[1]);
		else if(index%31==5) block35(s,col[2],row[2]);
		else if(index%31==6) block35(s,col[3],row[2]);
		else if(index%31==7) block35(s,col[4],row[2]);
		else if(index%31==8) block35(s,col[5],row[2]);
		else if(index%31==9) block35(s,col[6],row[2]);
		else if(index%31==10) block35(s,col[0],row[3]);
		else if(index%31==11) block35(s,col[1],row[3]);
		else if(index%31==12) block35(s,col[2],row[3]);
		else if(index%31==13) block35(s,col[3],row[3]);
		else if(index%31==14) block35(s,col[4],row[3]);
		else if(index%31==15) block35(s,col[5],row[3]);
		else if(index%31==16) block35(s,col[6],row[3]);
		else if(index%31==17) block35(s,col[0],row[4]);
		else if(index%31==18) block35(s,col[1],row[4]);
		else if(index%31==19) block35(s,col[2],row[4]);
		else if(index%31==20) block35(s,col[3],row[4]);
		else if(index%31==21) block35(s,col[4],row[4]);
		else if(index%31==22) block35(s,col[5],row[4]);
		else if(index%31==23) block35(s,col[6],row[4]);
		else if(index%31==24) block35(s,col[0],row[5]);
		else if(index%31==25) block35(s,col[1],row[5]);
		else if(index%31==26) block35(s,col[2],row[5]);
		else if(index%31==27) block35(s,col[3],row[5]);
		else if(index%31==28) block35(s,col[4],row[5]);
		else if(index%31==29) block35(s,col[5],row[5]);
		else if(index%31==30) block35(s,col[6],row[5]);
	}
	private void writeStar36(Student s, int index)
	{
		int row[] = {24,416,808,1200,1592,1984};			//6 Rows
		int col[] = {48,411,774,1137,1500,1863,2226,2589};	//8 Columns
		
		if(index%36==0) block40(s,col[2],row[1]);
		else if(index%36==1) block40(s,col[3],row[1]);
		else if(index%36==2) block40(s,col[4],row[1]);
		else if(index%36==3) block40(s,col[5],row[1]);
		else if(index%36==4) block40(s,col[6],row[1]);
		else if(index%36==5) block40(s,col[7],row[1]);
		else if(index%36==6) block40(s,col[2],row[2]);
		else if(index%36==7) block40(s,col[3],row[2]);
		else if(index%36==8) block40(s,col[4],row[2]);
		else if(index%36==9) block40(s,col[5],row[2]);
		else if(index%36==10) block40(s,col[6],row[2]);
		else if(index%36==11) block40(s,col[7],row[2]);
		else if(index%36==12) block40(s,col[0],row[3]);
		else if(index%36==13) block40(s,col[1],row[3]);
		else if(index%36==14) block40(s,col[2],row[3]);
		else if(index%36==15) block40(s,col[3],row[3]);
		else if(index%36==16) block40(s,col[4],row[3]);
		else if(index%36==17) block40(s,col[5],row[3]);
		else if(index%36==18) block40(s,col[6],row[3]);
		else if(index%36==19) block40(s,col[7],row[3]);
		else if(index%36==20) block40(s,col[0],row[4]);
		else if(index%36==21) block40(s,col[1],row[4]);
		else if(index%36==22) block40(s,col[2],row[4]);
		else if(index%36==23) block40(s,col[3],row[4]);
		else if(index%36==24) block40(s,col[4],row[4]);
		else if(index%36==25) block40(s,col[5],row[4]);
		else if(index%36==26) block40(s,col[6],row[4]);
		else if(index%36==27) block40(s,col[7],row[4]);
		else if(index%36==28) block40(s,col[0],row[5]);
		else if(index%36==29) block40(s,col[1],row[5]);
		else if(index%36==30) block40(s,col[2],row[5]);
		else if(index%36==31) block40(s,col[3],row[5]);
		else if(index%36==32) block40(s,col[4],row[5]);
		else if(index%36==33) block40(s,col[5],row[5]);
		else if(index%36==34) block40(s,col[6],row[5]);
		else if(index%36==35) block40(s,col[7],row[5]);
	}
	private void writeStar44(Student s, int index)
	{
		int row[] = {23,358,693,1028,1363,1698,2033};		//7 Rows
		int col[] = {40,405,770,1135,1500,1865,2230,2595};	//8 Columns
		
		if(index%44==0) block48(s,col[2],row[1]);
		else if(index%44==1) block48(s,col[3],row[1]);
		else if(index%44==2) block48(s,col[4],row[1]);
		else if(index%44==3) block48(s,col[5],row[1]);
		else if(index%44==4) block48(s,col[6],row[1]);
		else if(index%44==5) block48(s,col[7],row[1]);
		else if(index%44==6) block48(s,col[2],row[2]);
		else if(index%44==7) block48(s,col[3],row[2]);
		else if(index%44==8) block48(s,col[4],row[2]);
		else if(index%44==9) block48(s,col[5],row[2]);
		else if(index%44==10) block48(s,col[6],row[2]);
		else if(index%44==11) block48(s,col[7],row[2]);
		else if(index%44==12) block48(s,col[0],row[3]);
		else if(index%44==13) block48(s,col[1],row[3]);
		else if(index%44==14) block48(s,col[2],row[3]);
		else if(index%44==15) block48(s,col[3],row[3]);
		else if(index%44==16) block48(s,col[4],row[3]);
		else if(index%44==17) block48(s,col[5],row[3]);
		else if(index%44==18) block48(s,col[6],row[3]);
		else if(index%44==19) block48(s,col[7],row[3]);
		else if(index%44==20) block48(s,col[0],row[4]);
		else if(index%44==21) block48(s,col[1],row[4]);
		else if(index%44==22) block48(s,col[2],row[4]);
		else if(index%44==23) block48(s,col[3],row[4]);
		else if(index%44==24) block48(s,col[4],row[4]);
		else if(index%44==25) block48(s,col[5],row[4]);
		else if(index%44==26) block48(s,col[6],row[4]);
		else if(index%44==27) block48(s,col[7],row[4]);
		else if(index%44==28) block48(s,col[0],row[5]);
		else if(index%44==29) block48(s,col[1],row[5]);
		else if(index%44==30) block48(s,col[2],row[5]);
		else if(index%44==31) block48(s,col[3],row[5]);
		else if(index%44==32) block48(s,col[4],row[5]);
		else if(index%44==33) block48(s,col[5],row[5]);
		else if(index%44==34) block48(s,col[6],row[5]);
		else if(index%44==35) block48(s,col[7],row[5]);
		else if(index%44==36) block48(s,col[0],row[6]);
		else if(index%44==37) block48(s,col[1],row[6]);
		else if(index%44==38) block48(s,col[2],row[6]);
		else if(index%44==39) block48(s,col[3],row[6]);
		else if(index%44==40) block48(s,col[4],row[6]);
		else if(index%44==41) block48(s,col[5],row[6]);
		else if(index%44==42) block48(s,col[6],row[6]);
		else if(index%44==43) block48(s,col[7],row[6]);
		
	}
	private void writeOutlineText(String text, int width, int x, int y, Color outline, Color textColor)
	{
		/*
		bG.setColor(outline);
		printSimpleString(text, width, x+3, y);
		printSimpleString(text, width, x-3, y);
		printSimpleString(text, width, x, y+3);
		printSimpleString(text, width, x, y-3);*/
		bG.setColor(textColor);
		printSimpleString(text, width, x, y);
	}
	private void printSimpleString(String s, int width, int xPos, int yPos)
	{
		int stringLen = (int)bG.getFontMetrics().getStringBounds(s, bG).getWidth();
		while(stringLen>width)
		{
			bG.setFont(new Font(bG.getFont().getFontName(),bG.getFont().getStyle(),bG.getFont().getSize()-1));
			stringLen = (int)bG.getFontMetrics().getStringBounds(s, bG).getWidth();
		}
		int start = width/2 - stringLen/2;
		bG.drawString(s,start+xPos, yPos);
	}
	private void printLeftSimpleString(String s, int width, int xPos, int yPos)
	{
		int stringLen = (int)bG.getFontMetrics().getStringBounds(s, bG).getWidth();
		while(stringLen>width)
		{
			//System.out.println(s+": "+bG.getFont().getSize()+": "+stringLen);
			bG.setFont(new Font(bG.getFont().getFontName(),bG.getFont().getStyle(),bG.getFont().getSize()-1));
			stringLen = (int)bG.getFontMetrics().getStringBounds(s, bG).getWidth();
		}
		bG.drawString(s,xPos, yPos);
	}
}
