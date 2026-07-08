package photo.software.login;

import net.miginfocom.swing.MigLayout;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.JButton;
import java.awt.Font;

import java.awt.EventQueue;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import java.io.File;
import java.io.FileReader;
import java.util.Scanner;

/**
 * 
 * @author Troy
 *	The login Function and Main Method for TRECS.v6
 */

public class LoginGUIv7 {

	private JFrame frame;
	private String userName="";
	private JTextField textField;
	/**
	 * Launch the application.
	 * Creates the login Window
	 * @wbp.parser.entryPoint
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					new LoginGUIv7();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the application.
	 */
	public LoginGUIv7() {
		if(new File("LoginExempt.txt").exists())
		{
			Scanner in;
			try
			{
				in = new Scanner(new FileReader("LoginExempt.txt"));
				userName = in.next();
				in.close();
			}catch (Exception e) {JOptionPane.showMessageDialog(null, "LoginExempt.txt is just wrong.");}
			if(!loginFunction()) initialize();
		}
		else initialize();
	}

	/**
	 * Initialize the contents of the frame.
	 * Displays the login screen if there is no exemption file.
	 * @wbp.parser.entryPoint
	 */
	private void initialize() {
			
		frame = new JFrame();
		frame.setBounds(100, 100, 550, 186);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.getContentPane().setLayout(new MigLayout("", "[][grow]", "[][][][]"));
		
		
		JLabel lblTroysRediculouslyEfficient = new JLabel("Troy's Ridiculously Efficient Capture Software!");
		lblTroysRediculouslyEfficient.setFont(new Font("Tahoma", Font.BOLD, 20));
		frame.getContentPane().add(lblTroysRediculouslyEfficient, "cell 0 0 2 1,alignx center");
		
		JLabel lblUsername = new JLabel("Your Name:");
		lblUsername.setFont(new Font("Tahoma", Font.PLAIN, 20));
		frame.getContentPane().add(lblUsername, "cell 0 2,alignx trailing");
		
		textField = new JTextField();
		textField.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent e) {
				userName = textField.getText();
				if(loginFunction()) frame.dispose();
			}
		});
		textField.setFont(new Font("Tahoma", Font.PLAIN, 20));
		frame.getContentPane().add(textField, "cell 1 2,growx");
		textField.setColumns(10);
		
		JButton btnLogin = new JButton("Login");
		btnLogin.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent arg0) {
				userName = textField.getText().trim();
				if(loginFunction()) frame.dispose();
			}
		});
		frame.getContentPane().add(btnLogin, "cell 1 3,growx");
		frame.setVisible(true);
	}
	/**
	 * Checks validity of userName
	 * @return true if userName is good and able to construct the DesktopWindow, false if userName is not good
	 */
	private boolean loginFunction()
	{
		if(userName.contains("Remote"))
		{
			new DesktopWindow("Remote");
			return true;	
		}
		else if(userName.equals("NewSetup"))
		{
			new CreateProgramData();
			return true;
		}
		else
		{
			new DesktopWindow(userName);
			return true;
		}
	}

}

