package photo.software.sports;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.GraphicsConfiguration;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.Image;
import java.awt.RenderingHints;
import java.awt.Transparency;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;

import javax.imageio.ImageIO;
import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JOptionPane;
import javax.swing.JTextField;

@SuppressWarnings("serial")
public class MemoryMateGUI extends JInternalFrame implements ActionListener
{
	private JTextField textField;
	private JTextField textField_1;
	private JButton btnInputFolder, btnOutputFolder, btnRun;
	
	private Graphics2D gDimg,gResult;
	private int count;

	public MemoryMateGUI() {
		setBounds(100, 100, 450, 300);
		this.setVisible(true);
		this.setClosable(true);
		getContentPane().setLayout(new MigLayout("", "[][grow]", "[][][][][][][89.00,grow]"));
		
		btnInputFolder = new JButton("Input Folder");
		btnInputFolder.addActionListener(this);
		getContentPane().add(btnInputFolder, "cell 0 1,growx");
		
		textField = new JTextField();
		getContentPane().add(textField, "cell 1 1,growx");
		textField.setColumns(10);
		
		btnOutputFolder = new JButton("Output Folder");
		btnOutputFolder.addActionListener(this);
		getContentPane().add(btnOutputFolder, "cell 0 2");
		
		textField_1 = new JTextField();
		getContentPane().add(textField_1, "cell 1 2,growx");
		textField_1.setColumns(10);
		
		btnRun = new JButton("Run");
		btnRun.addActionListener(this);
		getContentPane().add(btnRun, "cell 1 4,alignx center");

	}

	private void startRun()
	{
		count = 0;
		int playerCount;
		File inputFolder = new File(textField.getText());
		if(!inputFolder.exists()) return;
		File currentTeamFolder;
		File[] playerImages;
		File[] teamFolders = inputFolder.listFiles();
		File memoryMate = null;
		boolean memory;
		for(int i=0;i<teamFolders.length;i++)
		{
			if(teamFolders[i].isDirectory())
			{
				currentTeamFolder = teamFolders[i];
				playerImages = currentTeamFolder.listFiles();
				memory = false;
				for(int j=0;j<playerImages.length;j++)
				{
					if(playerImages[j].getName().toUpperCase().endsWith(".PNG"))
					{
						memoryMate = playerImages[j];
						memory = true;
						break;
					}
				}
				if(memory)
				{
					playerCount = 0;
					for(int j=0;j<playerImages.length;j++)
					{
						if(playerImages[j].getName().toUpperCase().endsWith(".JPG"))
						{
							playerCount++;
							render(memoryMate, playerImages[j]);
						}
					}
					write(memoryMate.getName().substring(0,memoryMate.getName().lastIndexOf("."))+"\t"+playerCount);
				}
			}
		}
	}
	public void write(String line)
	{
		try{
			PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter(textField_1.getText()+"\\Counts.txt",true)));
			out.println(line);
			out.close();
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Error adding line to log: "+line);}
	}
	private void render(File memoryMate, File playerImage)
	{
		try 
		{
			String memoryName = memoryMate.getName().substring(0,memoryMate.getName().lastIndexOf("."));
			String playerName = playerImage.getName().substring(0,playerImage.getName().lastIndexOf("."));
			BufferedImage mImage = new BufferedImage(2550,3300,BufferedImage.TYPE_INT_RGB);
			Graphics2D mG = mImage.createGraphics();
			mG.setColor(Color.white);
			mG.fillRect(0, 0, 2550, 3300);
			
			BufferedImage iImage = new BufferedImage(2400,3150,BufferedImage.TYPE_INT_RGB);
			Graphics2D iG = iImage.createGraphics();
			iG.setColor(Color.white);
			iG.fillRect(0, 0, 2400, 3150);
			
			//Read Player Image and overlay
			BufferedImage pImage = ImageIO.read(playerImage);
			BufferedImage oImage = ImageIO.read(memoryMate);
			//Draw Player Image to Memory Mate
			mG.drawImage(pImage.getScaledInstance(-1, 1200, Image.SCALE_SMOOTH), 1280, 280, null);
			mG.drawImage(oImage, 0, 0, null);
			
			//Draw 5x7 and 4 Wallets to unit sheet
			BufferedImage tempImage = pImage.getSubimage(128, 0, 2143, pImage.getHeight());
			tempImage = resize(tempImage,750,1050);
			tempImage = rotate(tempImage);
			iG.drawImage(tempImage, 0, 0, null);
			iG.drawImage(tempImage, 1050, 0, null);
			iG.drawImage(tempImage, 0, 750, null);
			iG.drawImage(tempImage, 1050, 750, null);
			tempImage = pImage.getSubimage(128, 0, 2143, pImage.getHeight());
			tempImage = resize(tempImage,1500,2100);
			tempImage=rotate(tempImage);
			iG.drawImage(tempImage, 0, 1500, null);
			
			iG.setColor(Color.black);
			iG.setFont(new Font("Arial",Font.PLAIN,40));
			iG.drawString(memoryName+"_"+playerName, 50, 3100);
			
			ImageIO.write(mImage, "JPG", new File(textField_1.getText()+"\\Memory_"+memoryName+"_"+playerName+"_"+count+".jpg"));
			count++;
			ImageIO.write(iImage, "JPG", new File(textField_1.getText()+"\\Units_"+memoryName+"_"+playerName+"_"+count+".jpg"));
			count++;
			
			//Clear Images from memory
			pImage.flush();
			pImage = null;
			oImage.flush();
			oImage = null;
			tempImage.flush();
			tempImage = null;
			mImage.flush();
			mImage = null;
			iImage.flush();
			iImage = null;
			
		} catch (Exception e) {JOptionPane.showMessageDialog(null, "Error rendering image: "+e);}

	}

	@Override
	public void actionPerformed(ActionEvent arg0) 
	{
		Object pressed = arg0.getSource();
		if(pressed == btnInputFolder)
		{
			JFileChooser fc = new JFileChooser();
			fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			int returnVal = fc.showOpenDialog(null);
			if(returnVal == JFileChooser.APPROVE_OPTION)
			{
				textField.setText(fc.getSelectedFile().getAbsolutePath());
			}
		}
		else if(pressed == btnOutputFolder)
		{
			JFileChooser fc = new JFileChooser();
			fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			int returnVal = fc.showOpenDialog(null);
			if(returnVal == JFileChooser.APPROVE_OPTION)
			{
				textField_1.setText(fc.getSelectedFile().getAbsolutePath());
			}
		}
		else if(pressed == btnRun)
		{
			startRun();
		}
		
	}
	//////////////Buffered Image Operations/////////////
    public static GraphicsConfiguration getDefaultConfiguration() {
        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        GraphicsDevice gd = ge.getDefaultScreenDevice();
        return gd.getDefaultConfiguration();
    }
    public BufferedImage rotate(BufferedImage image) {
    	int angle = 90;
        double sin = Math.abs(Math.sin(Math.toRadians(angle))), cos = Math.abs(Math.cos(Math.toRadians(angle)));
        int w = image.getWidth(), h = image.getHeight();
        int neww = (int)Math.floor(w*cos+h*sin), newh = (int)Math.floor(h*cos+w*sin);
        GraphicsConfiguration gc = getDefaultConfiguration();
        BufferedImage result = gc.createCompatibleImage(neww, newh, Transparency.TRANSLUCENT);
        gResult = result.createGraphics();
        gResult.translate((neww-w)/2, (newh-h)/2);
        gResult.rotate((Math.toRadians(angle)), w/2, h/2);
        gResult.drawRenderedImage(image, null);
        gResult.dispose();
        return result;
    }
    public BufferedImage rotate(BufferedImage image, boolean b) {
    	int angle = 90;
    	if(b) angle = -90;
        double sin = Math.abs(Math.sin(Math.toRadians(angle))), cos = Math.abs(Math.cos(Math.toRadians(angle)));
        int w = image.getWidth(), h = image.getHeight();
        int neww = (int)Math.floor(w*cos+h*sin), newh = (int)Math.floor(h*cos+w*sin);
        GraphicsConfiguration gc = getDefaultConfiguration();
        BufferedImage result = gc.createCompatibleImage(neww, newh, Transparency.TRANSLUCENT);
        gResult = result.createGraphics();
        gResult.translate((neww-w)/2, (newh-h)/2);
        gResult.rotate((Math.toRadians(angle)), w/2, h/2);
        gResult.drawRenderedImage(image, null);
        gResult.dispose();
        return result;
    }
    public BufferedImage resize(final BufferedImage image, int newWidth, int newHeight) {
    	BufferedImage dimg = new BufferedImage(newWidth, newHeight, image.getType());
        gDimg = dimg.createGraphics();
        gDimg.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        gDimg.drawImage(image,0,0,newWidth,newHeight,null);
        gDimg.dispose();
        return dimg;
    }

}
