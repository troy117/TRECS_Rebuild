package photo.software.event;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;

import net.miginfocom.swing.MigLayout;

import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.JSpinner;
import javax.swing.SpinnerNumberModel;
import javax.swing.JButton;
import javax.swing.JFileChooser;

@SuppressWarnings("serial")
public class QRSheetMakerGUI extends JFrame {

	private JPanel contentPane;
	private JTextField textField, textField_1, textField_2;
	private JLabel lblSheets;
	private JSpinner spinner;
	private JLabel lblDownloadDate;
	private JButton btnRun;

	private String path;
	
	public QRSheetMakerGUI(final String refNum) 
	{
		setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
		this.setVisible(true);
		
		setBounds(100, 100, 600, 300);
		
		
		
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(new MigLayout("", "[][grow]", "[][][][][][][]"));
		
		JLabel lblEvent = new JLabel("Event:  ");
		contentPane.add(lblEvent, "cell 0 1,alignx right");
		
		textField = new JTextField();
		contentPane.add(textField, "cell 1 1,growx");
		textField.setColumns(10);
		
		JLabel lblLink = new JLabel("Link:  ");
		contentPane.add(lblLink, "cell 0 2,alignx right");
		
		textField_1 = new JTextField();
		textField_1.setText("http://download.islandphotography.net/");
		contentPane.add(textField_1, "cell 1 2,growx");
		textField_1.setColumns(10);
		
		lblSheets = new JLabel("Cards:  ");
		contentPane.add(lblSheets, "cell 0 3,alignx right");
		
		spinner = new JSpinner();
		spinner.setModel(new SpinnerNumberModel(10, 0, 500, 1));
		contentPane.add(spinner, "cell 1 3,alignx left");
		
		lblDownloadDate = new JLabel("Download Date:  ");
		contentPane.add(lblDownloadDate, "cell 0 4,alignx trailing");
		
		textField_2 = new JTextField();
		contentPane.add(textField_2, "cell 1 4,growx");
		textField_2.setColumns(10);
		
		btnRun = new JButton("Run");
		btnRun.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				JFileChooser fc = new JFileChooser();
				fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
				int returnVal = fc.showOpenDialog(null);
				if(returnVal==JFileChooser.APPROVE_OPTION)
				{
					path = fc.getSelectedFile().getAbsolutePath();
					new DigitalDownloadEventCards(Integer.parseInt(refNum),(Integer)spinner.getValue(),textField.getText(),
							textField_1.getText(),path,textField_2.getText());
				}
				
			}
		});
		contentPane.add(btnRun, "cell 1 6");
	}

}
