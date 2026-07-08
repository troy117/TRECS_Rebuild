package photo.software.event;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.Hashtable;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

public class DigitalDownloadEventCards 
{
	private BufferedImage bImage, cImage;
	private Graphics2D bG, cG;
	
	int refStart, count;
	String event, link, path, downloadDate;
	
	public static char enc[] = {'0','1','2','3','4','5','6','7','8','9'};
	public static char dec[] = {'X','G','P','B','A','L','R','C','F','H'};
	
	public DigitalDownloadEventCards(int refStart, int count, String event, String link, String path, String downloadDate)
	{
		this.refStart = refStart;
		this.count = count;
		this.event = event;
		this.link = link;
		this.path = path;
		this.downloadDate = downloadDate;
		beginProcess();
		sheetBuilder();
		
	}
	
	private void beginProcess()
	{
		try
		{
			bImage = new BufferedImage(3300,5100,BufferedImage.TYPE_INT_RGB);
			bG = bImage.createGraphics();
			bG.setColor(Color.white);
			bG.fillRect(0, 0, 3300, 5100);
			
			cImage = new BufferedImage(3300,1020,BufferedImage.TYPE_INT_RGB);
			cG = cImage.createGraphics();
			
			
			
		}catch(Exception e) {JOptionPane.showMessageDialog(null, "Error Card Creator: "+e.getLocalizedMessage());}
	}
	
	private void sheetBuilder()
	{
		try
		{
			int sheet = 0;
			for(int i=0;i<count;i++)
			{
				createCard(refStart+i);
				bG.drawImage(cImage, 0, (i%5)*1020,null);
				if(i%5==4)
				{
					ImageIO.write(bImage, "jpg", new File(path+"\\EventQRsheet_"+sheet+".jpg"));
					bG.setColor(Color.white);
					bG.fillRect(0, 0, 3300, 5100);
					sheet++;
				}
			}
			if(!new File(path+"\\EventQRsheet_"+sheet+".jpg").exists())
				ImageIO.write(bImage, "jpg", new File(path+"\\EventQRsheet_"+sheet+".jpg"));
			JOptionPane.showMessageDialog(null, "Complete!");
			
			
		}catch(Exception e) {JOptionPane.showMessageDialog(null, "Sheet Builder: "+e.getLocalizedMessage());}
	}
	
	private void createCard(int ref)
	{
		cG.setColor(Color.white);
		cG.fillRect(0, 0, 3300, 1020);
		cG.setColor(Color.black);
		
		/**
		 * This is where I will put the text fields for name.
		 * Lines to use for image boxes
		 * Ref #'s
		 * QR Code
		 */
		cG.setFont(new Font("Arial",Font.PLAIN,50));
		cG.drawString("Images:", 600, 360);
		cG.drawRect(600, 300, 600, 600);
		
		cG.drawString(event, 150, 150);
		cG.drawString("Name:", 150, 210);
		
		cG.drawString("Ref #: "+ref, 150, 900);
		cG.drawString("Ref #: "+ref, 2500, 900);
		
		cG.drawImage(createQRImage(link+doEncryption(ref+"")+".jpg", 600), 1800, 300, null);
		
		
		
		cG.drawString("Scan the QR code with you phone after " +downloadDate, 1800, 140);
		cG.drawString("to download your image.  Images provided at NO charge", 1800, 200);
		cG.drawString("Link expires in one month.  ", 1800, 260);
		cG.drawString("For questions: info@islandphotography.net", 1800, 320);
		
	}
	@SuppressWarnings("unchecked")
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
	}
	private String doEncryption(String s)
	{
        char c[] = new char[(s.length())];
        for (int i = 0; i < s.length(); i++)
        {
            for (int j = 0; j < 26; j++)
            {
                if (enc[j] == s.charAt(i))
                {
                    c[i] = dec[j];
                    break;
                }
            }
        }
        return (new String(c));
	}
}
