package photo.software.student.capture;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;

import net.miginfocom.swing.MigLayout;

@SuppressWarnings("serial")
public class DisplayEnvelopesGUI extends JInternalFrame {

	private BufferedImage bImage;
	private Image scaled;
	private JPanel panel;
	private JLabel imgLabel;
	public DisplayEnvelopesGUI(ArrayList<File> envelopes) 
	{
		setBounds(100, 100, 600, 751);
		this.setVisible(true);
		this.setClosable(true);
		getContentPane().setLayout(new MigLayout("", "[570.00]", "[700.00]"));
		
		JScrollPane scrollPane = new JScrollPane();
		getContentPane().add(scrollPane, "cell 0 0,grow");
		
		panel = new JPanel();
		scrollPane.setViewportView(panel);
		String title = "";
		for(File e:envelopes)
		{
			try
			{
				bImage = ImageIO.read(e);
				scaled = bImage.getScaledInstance(550, -1, Image.SCALE_FAST);
				imgLabel = new JLabel(new ImageIcon(scaled));
				panel.add(imgLabel);
				bImage.flush();
				scaled.flush();
				title+=e.getName()+"\t";
			}catch(Exception err){JOptionPane.showMessageDialog(null, "Error Displaying Envelope: "+e);}
		}
		title.trim();
		this.setTitle(title);

	}
	

}
