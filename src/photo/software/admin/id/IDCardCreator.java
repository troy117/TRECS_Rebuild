package photo.software.admin.id;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.GraphicsConfiguration;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.Image;
import java.awt.Transparency;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.swing.JFileChooser;
import javax.swing.JOptionPane;

import photo.software.student.Student;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.Table;


public class IDCardCreator 
{
	private ArrayList<Student> students;
	private ArrayList<Template> templates;
	private Template stuTemp, facTemp, template;
	private BufferedImage img, sImage, bImage,iImage;
	private Graphics2D g, bG;
	private int count;
	private boolean renderedAll;
	private String schoolPath,overrideBackground;
	String outputPath,year="";
	
	public IDCardCreator(String outputPath)
	{
		this.outputPath = outputPath;
	}

	public ArrayList<String> getTemplates()
	{
		loadTemplateInformation();
		ArrayList<String> list = new ArrayList<String>();
		list.add("");
		for(Template t:templates) list.add(t.plan);
		return list;
	}
	private void loadTemplateInformation()
	{
		templates = new ArrayList<Template>();
		try
		{
			Database db = DatabaseBuilder.open(new File("ProgramData.accdb"));
			Table table = db.getTable("IDtemplate");
			String[] rowValues = new String[48];
			for(Map<String, Object> row:table)
			{
				try{
					rowValues[0] = row.get("ID").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[0] = "0";
				}
				try{
					rowValues[1] = row.get("Plan").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[1] = "0";
				}
				try{
					rowValues[2] = row.get("Vertical").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[2] = "false";
				}
				try{
					rowValues[3] = row.get("ImageX").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[3] = "0";
				}
				try{
					rowValues[4] = row.get("ImageY").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[4] = "0";
				}
				try{
					rowValues[5] = row.get("ImageW").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[5] = "0";
				}
				try{
					rowValues[6] = row.get("NameX").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[6] = "0";
				}
				try{
					rowValues[7] = row.get("NameY").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[7] = "0";
				}
				try{
					rowValues[8] = row.get("NameW").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[8] = "0";
				}
				try{
					rowValues[9] = row.get("FirstX").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[9] = "0";
				}
				try{
					rowValues[10] = row.get("FirstY").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[10] = "0";
				}
				try{
					rowValues[11] = row.get("LastX").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[11] = "0";
				}
				try{
					rowValues[12] = row.get("LastY").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[12] = "0";
				}
				try{
					rowValues[13] = row.get("NameColor").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[13] = "Black";
				}
				try{
					rowValues[14] = row.get("NameFont").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[14] = "0";
				}
				try{
					rowValues[15] = row.get("NameSize").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[15] = "0";
				}
				try{
					rowValues[16] = row.get("BarcodeX").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[16] = "0";
				}
				try{
					rowValues[17] = row.get("BarcodeY").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[17] = "0";
				}
				try{
					rowValues[18] = row.get("BarcodeFont").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[18] = "Code39FiveText";
				}
				try{
					rowValues[19] = row.get("BarcodeSize").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[19] = "0";
				}
				try{
					rowValues[20] = row.get("HomeX").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[20] = "0";
				}
				try{
					rowValues[21] = row.get("HomeY").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[21] = "0";
				}
				try{
					rowValues[22] = row.get("HomeW").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[22] = "0";
				}
				try{
					rowValues[23] = row.get("HomeColor").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[23] = "Black";
				}
				try{
					rowValues[24] = row.get("HomeFont").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[24] = "Arial";
				}
				try{
					rowValues[25] = row.get("HomeSize").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[25] = "0";
				}
				try{
					rowValues[26] = row.get("IDNumX").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[26] = "0";
				}
				try{
					rowValues[27] = row.get("IDNumY").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[27] = "0";
				}
				try{
					rowValues[28] = row.get("IDNumFont").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[28] = "Arial";
				}
				try{
					rowValues[29] = row.get("IDNumSize").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[29] = "0";
				}
				try{
					rowValues[30] = row.get("Extra1X").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[30] = "0";
				}
				try{
					rowValues[31] = row.get("Extra1Y").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[31] = "0";
				}
				try{
					rowValues[32] = row.get("Extra1W").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[32] = "0";
				}
				try{
					rowValues[33] = row.get("Extra1Color").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[33] = "Black";
				}
				try{
					rowValues[34] = row.get("Extra1Font").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[34] = "Arial";
				}
				try{
					rowValues[35] = row.get("Extra1Size").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[35] = "0";
				}
				try{
					rowValues[36] = row.get("Extra2X").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[36] = "0";
				}
				try{
					rowValues[37] = row.get("Extra2Y").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[37] = "0";
				}
				try{
					rowValues[38] = row.get("Extra2W").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[38] = "0";
				}
				try{
					rowValues[39] = row.get("Extra2Color").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[39] = "Black";
				}
				try{
					rowValues[40] = row.get("Extra2Font").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[40] = "Arial";
				}
				try{
					rowValues[41] = row.get("Extra2Size").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[41] = "0";
				}
				try{
					rowValues[42] = row.get("YearX").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[42] = "0";
				}
				try{
					rowValues[43] = row.get("YearY").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[43] = "0";
				}
				try{
					rowValues[44] = row.get("YearColor").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[44] = "0";
				}
				try {
					rowValues[45] = row.get("qrX").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[45] ="0";
				}
				try {
					rowValues[46] = row.get("qrY").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[46] ="0";
				}
				try {
					rowValues[47] = row.get("qrSize").toString().trim();
				}
				catch(NullPointerException e){
					rowValues[47] ="0";
				}
				
				templates.add(new Template(rowValues[0],rowValues[1],rowValues[2],rowValues[3],rowValues[4],
									rowValues[5],rowValues[6],rowValues[7],rowValues[8],rowValues[9],
									rowValues[10],rowValues[11],rowValues[12],rowValues[13],rowValues[14],
									rowValues[15],rowValues[16],rowValues[17],rowValues[18],rowValues[19],
									rowValues[20],rowValues[21],rowValues[22],rowValues[23],rowValues[24],
									rowValues[25],rowValues[26],rowValues[27],rowValues[28],rowValues[29],
									rowValues[30],rowValues[31],rowValues[32],rowValues[33],rowValues[34],
									rowValues[35],rowValues[36],rowValues[37],rowValues[38],rowValues[39],
									rowValues[40],rowValues[41],rowValues[42],rowValues[43],rowValues[44],
									rowValues[45],rowValues[46],rowValues[47]));
			}
			db.close();
			
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Load Template Error: "+e);}
	}
	
	public void override(String background, String temp,ArrayList<Student> students, String schoolPath, Boolean individual)
	{
		overrideBackground=background;
		for(Template t:templates) if(t.plan.equals(temp)) template = t;
		this.students=students;
		this.schoolPath=schoolPath;
		count=0;
		if(individual) beginIndividual(true);
		else beginProcess(true);		
	}
	
	public void regular(String studentTemp, String facultyTemp,ArrayList<Student> students, String schoolPath, Boolean individual)
	{
		for(Template t:templates)
		{
			if(t.plan.equals(studentTemp)) stuTemp = t;
			if(t.plan.equals(facultyTemp)) facTemp = t;
		}
		this.students=students;
		this.schoolPath=schoolPath;
		count=0;
		if(individual) beginIndividual(false);
		else beginProcess(false);		
	}	

	public void beginIndividual(Boolean override)
	{
		int startCount=0;
		try
		{
			for(int i=0;i<students.size();i++)
			{
				iImage = new BufferedImage(1128, 702, BufferedImage.TYPE_INT_RGB);
				if(override) overrideBackground();
				else
				{
					template = stuTemp;
					if(students.get(i).grade.equals("FAC")) template = facTemp;
					openBackground(students.get(i));
				}
				openStudent(students.get(i));
				writer(students.get(i));
				if(template.vertical.equals("true")) img = rotate(img);
				if((new File("IDs")).exists())
				{
					startCount = (new File("IDs")).list().length;
				}
				else (new File("IDs")).mkdir();
				iImage.createGraphics().drawImage(img, 0, 0, null);
				
				ImageIO.write(iImage, "jpg", new File("IDs\\"+String.format("%05d", startCount+1)+".jpg"));
				iImage.flush();
				img.flush();
				
			}
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Begin Individual: "+e);}
	}
	
	public void standaloneSheetGenerator()
	{
		JFileChooser fc = new JFileChooser();
		fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		int returnVal = fc.showOpenDialog(null);
		if(returnVal == JFileChooser.APPROVE_OPTION)
		{
			File idsFolder = fc.getSelectedFile();
            FilenameFilter jpgFilter = new FilenameFilter() {
                public boolean accept(File dir, String name) {
                    return name.toLowerCase().endsWith(".jpg") || name.toLowerCase().endsWith(".jpeg");
                }
            };
            File[] looseIDs = idsFolder.listFiles(jpgFilter);
            File subFolder = new File(idsFolder, "merged");
            subFolder.mkdir();
            outputPath = subFolder.getAbsolutePath();
            
            try
            {
            	bImage = new BufferedImage(3600,5400,BufferedImage.TYPE_INT_RGB);
            	bG = bImage.createGraphics();
    			bG.setColor(Color.white);
    			bG.fillRect(0, 0, 3600, 5400);
    			count=0;
    			template = new Template();
    			for(int i=0;i<looseIDs.length;i++)
    			{
    				if(i%21==0)
    				{
    					bG.fillRect(0, 0, 3600, 5400);
    					count++;
    				}
    				img = ImageIO.read(looseIDs[i]);
    				if(img.getHeight()>img.getWidth()) img = rotate(img);
    				writeFinal(i);
    			}
    			if(!renderedAll)
    			{
        			bG.setColor(Color.black);
        			bG.setFont(new Font("Arial",Font.PLAIN,50));
        			bG.drawString("Page: "+count, 1250, 5350);
        			bG.setColor(Color.white);
        			if(outputPath.equals(""))	ImageIO.write(bImage, "jpg", new File(schoolPath+"\\ID_Cards\\"+count+".jpg"));
        			else ImageIO.write(bImage, "jpg", new File(outputPath+"\\"+count+".jpg"));
    				renderedAll=true;
    			}
            }catch(Exception e) {}
		}
	}
	

	public void beginProcess(Boolean override)
	{
		if(outputPath.equals(""))
		{
			JFileChooser fc = new JFileChooser();
			fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			int returnVal = fc.showOpenDialog(null);
			if(returnVal == JFileChooser.APPROVE_OPTION)
			{
				outputPath = fc.getSelectedFile().getAbsolutePath();
			}
			(new File(schoolPath+"\\ID_Cards")).mkdirs();
		}
		try
		{
			bImage = new BufferedImage(3600,5400, BufferedImage.TYPE_INT_RGB);
			bG = bImage.createGraphics();
			bG.setColor(Color.white);
			bG.fillRect(0, 0, 3600, 5400);
			for(int i = 0;i<students.size();i++)
			{
				if(i%21==0)
				{
					bG.fillRect(0, 0, 3600, 5400);
					count++;
				}
				if(override) overrideBackground();
				else
				{
					template = stuTemp;
					if(students.get(i).grade.equals("FAC")) template = facTemp;
					openBackground(students.get(i));
				}
				openStudent(students.get(i));
				writer(students.get(i));
				writeFinal(i);
			}
			if(!renderedAll)
			{
    			bG.setColor(Color.black);
    			bG.setFont(new Font("Arial",Font.PLAIN,50));
    			bG.drawString("Page: "+count, 1250, 5350);
    			bG.setColor(Color.white);
    			if(outputPath.equals(""))	ImageIO.write(bImage, "jpg", new File(schoolPath+"\\ID_Cards\\"+count+".jpg"));
    			else ImageIO.write(bImage, "jpg", new File(outputPath+"\\"+count+".jpg"));
				renderedAll=true;
			}
		}catch(Exception e){}
	}
	public void overrideBackground()
	{
		try 
		{
			img = ImageIO.read(new File(schoolPath+"\\Templates\\"+overrideBackground));
			g = img.createGraphics();
			
		} catch (IOException e) 
		{
			JOptionPane.showMessageDialog(null,"Error Opening Template for "+overrideBackground+": "+e);
		}
	}
	public void openBackground(Student s)
	{
		try 
		{
			img = ImageIO.read(new File(schoolPath+"\\Templates\\"+s.grade+".jpg"));
			g = img.createGraphics();
			
		} catch (IOException e) 
		{
			JOptionPane.showMessageDialog(null,"Error Opening Template for "+s.grade+": "+e);
		}
	}
	
	public void openStudent(Student s)
	{
		if(s.photo.equals("true"))
		{
			try
			{				
				g.setColor(Color.black);
				g.fillRect(template.iX-3, template.iY-3, template.iW+6, (int)(template.iW*1.25)+6);
				
				sImage = ImageIO.read(new File(schoolPath+"\\CroppedSmall\\"+s.ref+".jpg"));
				g.drawImage(sImage.getScaledInstance(template.iW, -1, Image.SCALE_SMOOTH),template.iX, template.iY,null);
			}catch(Exception e){System.out.println("Error Opening Student Image");}
		}
	}
    public static GraphicsConfiguration getDefaultConfiguration() {
        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        GraphicsDevice gd = ge.getDefaultScreenDevice();
        return gd.getDefaultConfiguration();
    }	
    public BufferedImage rotate(BufferedImage image) {
    	Graphics2D gResult;
        double sin = Math.abs(Math.sin(Math.toRadians(90))), cos = Math.abs(Math.cos(Math.toRadians(90)));
        int w = image.getWidth(), h = image.getHeight();
        int neww = (int)Math.floor(w*cos+h*sin), newh = (int)Math.floor(h*cos+w*sin);
        GraphicsConfiguration gc = getDefaultConfiguration();
        BufferedImage result = gc.createCompatibleImage(neww, newh, Transparency.TRANSLUCENT);
        gResult = result.createGraphics();
        gResult.translate((neww-w)/2, (newh-h)/2);
        gResult.rotate((Math.toRadians(90)), w/2, h/2);
        gResult.drawRenderedImage(image, null);
        gResult.dispose();
        return result;
    }
	
	public void writer(Student s)
	{
		FontMetrics fm;
		int width;
		int tempSize;
		String tempFont;
		try
		{
			//Name Writer
			if((template.nX!=0)&&(template.nY!=0))
			{
				g.setColor(template.nameColor);
				g.setFont(template.nameFont);
				fm = g.getFontMetrics();
				if(template.nW!=0)
				{
					width = fm.stringWidth(s.first+" "+s.last);
					tempSize = g.getFont().getSize();
					tempFont = g.getFont().getFontName();
					while(width>template.nW)
					{
						tempSize = tempSize-1;
						g.setFont(new Font(tempFont,Font.BOLD,tempSize));
						fm = g.getFontMetrics();
						width = fm.stringWidth(s.first+" "+s.last);
					}
					if(template.plan.contains("CENTER")) g.drawString(s.first+" "+s.last, template.nX-(width/2), template.nY);
					else if(template.plan.contains("RIGHT")) g.drawString(s.first+" "+s.last, template.nX-width, template.nY);
				}
				if((!template.plan.contains("CENTER"))&&(!template.plan.contains("RIGHT"))) g.drawString(s.first+" "+s.last, template.nX, template.nY);
			}
			if((template.lX!=0)&&(template.lY!=0))
			{
				g.setColor(template.nameColor);
				g.setFont(template.nameFont);
				fm = g.getFontMetrics();
				if(template.nW!=0)
				{
					width = fm.stringWidth(s.last);
					tempSize = g.getFont().getSize();
					tempFont = g.getFont().getFontName();
					while(width>template.nW)
					{
						tempSize = tempSize-1;
						g.setFont(new Font(tempFont,Font.BOLD,tempSize));
						fm = g.getFontMetrics();
						width = fm.stringWidth(s.last);
					}
					if(template.plan.contains("CENTER")) g.drawString(s.last, template.lX-(width/2), template.nY);
					else if(template.plan.contains("RIGHT")) g.drawString(s.last, template.lX-width, template.lY);
				}
				if(!template.plan.contains("RIGHT")&&!template.plan.contains("CENTER")) g.drawString(s.last, template.lX, template.lY);
			}
			if((template.fX!=0)&&(template.fY!=0))
			{
				g.setColor(template.nameColor);
				g.setFont(template.nameFont);
				fm = g.getFontMetrics();
				if(template.nW!=0)
				{
					width = fm.stringWidth(s.first);
					tempSize = g.getFont().getSize();
					tempFont = g.getFont().getFontName();
					while(width>template.nW)
					{
						tempSize = tempSize-1;
						g.setFont(new Font(tempFont,Font.BOLD,tempSize));
						fm = g.getFontMetrics();
						width = fm.stringWidth(s.first);
					}
					if(template.plan.contains("CENTER")) g.drawString(s.first, template.fX-(width/2), template.fY);
					else if(template.plan.contains("RIGHT")) g.drawString(s.first, template.fX-width, template.fY);
				}
				if(!template.plan.contains("RIGHT")&&!template.plan.contains("CENTER")) g.drawString(s.first, template.fX, template.fY);
			}
			//Barcode Writer
			if((template.bX!=0)&&(template.bY!=0)&&(!s.ID.equals("")))
			{
				g.setColor(Color.black);
				g.setFont(template.barcodeFont);
				if(template.plan.contains("CENTER"))
				{
					fm = g.getFontMetrics();
					width = fm.stringWidth("*"+s.ID+"*");
					g.drawString("*"+s.ID+"*", template.bX-(width/2),template.bY);	
				}
				else g.drawString("*"+s.ID+"*", template.bX, template.bY);
			}
			//Homeroom Writer
			if((template.hX!=0)&&(template.hY!=0)&&(!s.homeroom.equals("")))
			{
				g.setColor(template.homeColor);
				g.setFont(template.homeFont);
				
				fm = g.getFontMetrics();
				if(template.hW!=0)
				{
					width = fm.stringWidth("HR: "+s.homeroom);
					tempSize = g.getFont().getSize();
					tempFont = g.getFont().getFontName();
					while(width>template.hW)
					{
						tempSize = tempSize-1;
						g.setFont(new Font(tempFont,Font.BOLD,tempSize));
						fm = g.getFontMetrics();
						width = fm.stringWidth("HR: "+s.homeroom);
					}
				}
				g.drawString("HR: "+s.homeroom, template.hX, template.hY);
			}
			//ID1 Writer
			if((template.idX!=0)&&(template.idY!=0)&&(!s.ID.equals("")))
			{
				g.setColor(Color.black);
				g.setFont(template.idFont);
				
				if(template.plan.contains("CENTER"))
				{
					//g.setColor(template.nameColor);
					fm = g.getFontMetrics();
					width = fm.stringWidth("ID #: "+s.ID);
					g.drawString("ID #: "+s.ID, template.idX-(width/2),template.idY);	
				}
				else g.drawString("ID #: "+s.ID, template.idX, template.idY);
				
				
			}
			//Extra1 Writer
			if((template.e1X!=0)&&(template.e1Y!=0))
			{
				g.setColor(template.e1Color);
				g.setFont(template.e1Font);
				
				fm = g.getFontMetrics();
				if(template.e1W!=0)
				{
					width = fm.stringWidth(s.field1);
					tempSize = g.getFont().getSize();
					tempFont = g.getFont().getFontName();
					while(width>template.e1W)
					{
						tempSize = tempSize-2;
						g.setFont(new Font(tempFont,Font.BOLD,tempSize));
						fm = g.getFontMetrics();
						width = fm.stringWidth(s.field1);
					}
					if(template.plan.contains("CENTER")) g.drawString(s.field1, template.e1X-(width/2), template.e1Y);
					else if(template.plan.contains("RIGHT")) g.drawString(s.field1, template.e1X-width, template.e1Y);
				}
				if((!template.plan.contains("CENTER"))&&(!template.plan.contains("RIGHT"))) g.drawString(s.field1, template.e1X, template.e1Y);
				
				
			}
			//Extra2 Writer
			if((template.e2X!=0)&&(template.e2Y!=0))
			{
				g.setColor(template.e2Color);
				g.setFont(template.e2Font);
				
				fm = g.getFontMetrics();
				if(template.e2W!=0)
				{
					width = fm.stringWidth(s.field2);
					tempSize = g.getFont().getSize();
					tempFont = g.getFont().getFontName();
					while(width>template.e2W)
					{
						tempSize = tempSize-2;
						g.setFont(new Font(tempFont,Font.BOLD,tempSize));
						fm = g.getFontMetrics();
						width = fm.stringWidth(s.field2);
					}
					if(template.plan.contains("CENTER")) g.drawString(s.field2, template.e2X-(width/2), template.e2Y);
					else if(template.plan.contains("RIGHT")) g.drawString(s.field2, template.e2X-width, template.e2Y);
				}
				if((!template.plan.contains("CENTER"))&&(!template.plan.contains("RIGHT")))	g.drawString(s.field2, template.e2X, template.e2Y);
			}
			//Year Writer
			if((template.yX!=0)&&(template.yY!=0))
			{
				g.setColor(template.yearColor);
				g.setFont(new Font("Myriad Pro",Font.BOLD,55));
				g.drawString(year, template.yX, template.yY);
			}
			//QR Writer
			if((template.qrX!=0)&&(template.qrY!=0))
			{				
				g.setColor(Color.black);
				g.drawImage(createQRImage(s.ID,template.qrSize), template.qrX, template.qrY, null);	
			}			
			
		}catch(Exception e){System.out.println("Error Writing Information");}
	}
	private static BufferedImage createQRImage(String qrCodeText, int size)
	{
		
		try{
			QRCodeWriter barcodeWriter = new QRCodeWriter();
		BitMatrix bitMatrix = barcodeWriter.encode(qrCodeText, BarcodeFormat.QR_CODE, size, size);
		return MatrixToImageWriter.toBufferedImage(bitMatrix);
		}catch(Exception e){}
		return null;
	}
	
	/*
	private static BufferedImage createQRImage(String qrCodeText, int size) {
		
		BufferedImage image = null;
		try {
			// Create the ByteMatrix for the QR-Code that encodes the given String
			@SuppressWarnings("rawtypes")
			Hashtable hintMap = new Hashtable();
			hintMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
			QRCodeWriter qrCodeWriter = new QRCodeWriter();
			BitMatrix byteMatrix;
	
				byteMatrix = qrCodeWriter.encode(qrCodeText,
						BarcodeFormat.QR_CODE, size, size, hintMap);
	
			// Make the BufferedImage that are to hold the QRCode
			int matrixWidth = byteMatrix.getWidth();
			image = new BufferedImage(matrixWidth, matrixWidth,
					BufferedImage.TYPE_INT_RGB);
			image.createGraphics();
	
			Graphics2D graphics = (Graphics2D) image.getGraphics();
			graphics.setColor(Color.WHITE);
			graphics.fillRect(0, 0, matrixWidth, matrixWidth);
			// Paint and save the image using the ByteMatrix
			graphics.setColor(Color.BLACK);
	
			for (int i = 0; i < matrixWidth; i++) {
				for (int j = 0; j < matrixWidth; j++) {
					if (byteMatrix.get(i, j)) {
						graphics.fillRect(i, j, 1, 1);
					}
				}
			}
		} catch (WriterException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return image;
	}*/
	
	public void setYear(String year)
	{
		this.year = year;
	}
	
	public void writeFinal(int i)
	{
		renderedAll = false;
		try {
			if(template.vertical.equals("true")) img = rotate(img);
			if(i%21==0)      bG.drawImage(img, 112, 244, null);
			else if(i%21==1) bG.drawImage(img, 1240, 244, null);
			else if(i%21==2) bG.drawImage(img, 2368, 244, null);
			else if(i%21==3) bG.drawImage(img, 112, 946, null);
			else if(i%21==4) bG.drawImage(img, 1240, 946, null);
			else if(i%21==5) bG.drawImage(img, 2368, 946, null);
			else if(i%21==6) bG.drawImage(img, 112, 1648, null);
			else if(i%21==7) bG.drawImage(img, 1240, 1648, null);
			else if(i%21==8) bG.drawImage(img, 2368, 1648, null);
			else if(i%21==9) bG.drawImage(img, 112, 2350, null);
			else if(i%21==10) bG.drawImage(img, 1240, 2350, null);
			else if(i%21==11) bG.drawImage(img, 2368, 2350, null);
			else if(i%21==12) bG.drawImage(img, 112, 3052, null);
			else if(i%21==13) bG.drawImage(img, 1240, 3052, null);
			else if(i%21==14) bG.drawImage(img, 2368, 3052, null);
			else if(i%21==15) bG.drawImage(img, 112, 3754, null);
			else if(i%21==16) bG.drawImage(img, 1240, 3754, null);
			else if(i%21==17) bG.drawImage(img, 2368, 3754, null);
			else if(i%21==18) bG.drawImage(img, 112, 4456, null);
			else if(i%21==19) bG.drawImage(img, 1240, 4456, null);
			else if(i%21==20)
			{
				bG.drawImage(img, 2368, 4456, null);
				bG.setColor(Color.black);
				bG.setFont(new Font("Arial",Font.PLAIN,50));
				bG.drawString("Page: "+count, 1250, 5350);
				bG.setColor(Color.white);
    			if(outputPath.equals(""))	ImageIO.write(bImage, "jpg", new File(schoolPath+"\\ID_Cards\\"+count+".jpg"));
    			else ImageIO.write(bImage, "jpg", new File(outputPath+"\\"+count+".jpg"));
    			renderedAll=true;
			}
			
		}catch(Exception e) {JOptionPane.showMessageDialog(null, "Write error: "+e);}
	}
}
