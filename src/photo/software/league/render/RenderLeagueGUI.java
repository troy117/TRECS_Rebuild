package photo.software.league.render;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.util.ArrayList;

import javax.swing.JInternalFrame;

import net.miginfocom.swing.MigLayout;

import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JLabel;
import javax.swing.JComboBox;
import javax.swing.JOptionPane;
import javax.swing.JProgressBar;
import javax.swing.JTextArea;

import photo.software.league.LeagueGUI;
import photo.software.league.LeaguePlayer;

import javax.swing.JScrollPane;
import javax.swing.event.InternalFrameEvent;
import javax.swing.event.InternalFrameListener;
import javax.swing.JCheckBox;

@SuppressWarnings("serial")
public class RenderLeagueGUI extends JInternalFrame implements ActionListener
{
	private JComboBox<String> comboBox, comboBox_1;
	private JButton btnOutput, btnRenderAll, btnRenderSelectedIn;
	private JLabel label;
	LeagueGUI leagueGUI;
	ArrayList<LeaguePlayer> players;
	private File outputFolder=null;
	private JTextArea textPane;
	private JScrollPane scrollPane;
	private JProgressBar progressBar;
	private Thread renderThread;
	private JCheckBox chckbxRenderOutLabels;
	public RenderLeagueGUI(LeagueGUI leagueGUI) 
	{
		this.leagueGUI = leagueGUI;
		this.players = leagueGUI.getPlayers();
		
		initialize();
		
		if(leagueGUI.job.plan.equals("LEAGUE MM&8W")) comboBox.setSelectedIndex(0);
		else if(leagueGUI.job.plan.equals("LEAGUE 8x10")) comboBox.setSelectedIndex(1);
		else if(leagueGUI.job.plan.equals("LEAGUE MM&4W5x7")) comboBox.setSelectedIndex(2);
		//else if(leagueGUI.job.plan.equals("FREE_WALLET_COUNT")) comboBox.setSelectedIndex(2);
		//else if(leagueGUI.job.plan.equals("FREE_DANCE")) comboBox.setSelectedIndex(3);
	}
	private void initialize()
	{
		setBounds(100, 100, 450, 371);
		this.addInternalFrameListener(new InternalFrameListener(){

			@Override
			public void internalFrameActivated(InternalFrameEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void internalFrameClosed(InternalFrameEvent arg0) {

			}

			@Override
			public void internalFrameClosing(InternalFrameEvent arg0) {
				close();
			}

			@Override
			public void internalFrameDeactivated(InternalFrameEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void internalFrameDeiconified(InternalFrameEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void internalFrameIconified(InternalFrameEvent arg0) {
				// TODO Auto-generated method stub
				
			}

			@Override
			public void internalFrameOpened(InternalFrameEvent arg0) {
				// TODO Auto-generated method stub
				
			}
			
		});
		getContentPane().setLayout(new MigLayout("", "[][grow]", "[][][][][][][36.00][grow]"));
		
		JLabel lblPackagePlan = new JLabel("Package Plan:");
		getContentPane().add(lblPackagePlan, "cell 0 0,alignx trailing");
		
		comboBox = new JComboBox<String>();
		comboBox.addItem("LEAGUE MM&8W");
		comboBox.addItem("LEAGUE 8x10");
		comboBox.addItem("LEAGUE MM&4W5x7");
		//comboBox.addItem("FREE_DANCE");
		getContentPane().add(comboBox, "cell 1 0,growx");
		
		JLabel lblSortMethod = new JLabel("Sort Method:");
		getContentPane().add(lblSortMethod, "cell 0 1,alignx trailing");
		
		comboBox_1 = new JComboBox<String>();
		comboBox_1.addItem("");
		comboBox_1.addItem("SORT BY REFERENCE NUMBER");
		comboBox_1.addItem("SORT BY IMAGE NUMBER");
		comboBox_1.addItem("SORT ALPHA BY TEAM");
		getContentPane().add(comboBox_1, "cell 1 1,growx");
		
		btnOutput = new JButton("Output:");
		btnOutput.addActionListener(this);
		getContentPane().add(btnOutput, "cell 0 2");
		
		label = new JLabel("");
		getContentPane().add(label, "cell 1 2");
		
		btnRenderAll = new JButton("Render All");
		btnRenderAll.addActionListener(this);
		getContentPane().add(btnRenderAll, "cell 1 3,growx");
		
		btnRenderSelectedIn = new JButton("Render Selected in Table");
		btnRenderSelectedIn.addActionListener(this);
		getContentPane().add(btnRenderSelectedIn, "cell 1 4,growx");
		
		chckbxRenderOutLabels = new JCheckBox("Render Out Envelopes");
		getContentPane().add(chckbxRenderOutLabels, "cell 1 5");
		
		progressBar = new JProgressBar(0,100);
		getContentPane().add(progressBar, "cell 0 6 2 1,grow");
		
		scrollPane = new JScrollPane();
		getContentPane().add(scrollPane, "cell 0 7 2 1,grow");
		
		textPane = new JTextArea();
		scrollPane.setViewportView(textPane);
		this.setVisible(true);
		this.setClosable(true);
	}

	public void close()
	{
		if(renderThread!=null) renderThread.interrupt();
		this.dispose();
	}
	public void updateProgressBar(int percent)
	{
		progressBar.setValue(percent);
	}
	public void printText(String s)
	{
		textPane.insert(s, 0);
	}
	@Override
	public void actionPerformed(ActionEvent arg0) {
		Object pressed = arg0.getSource();
		if(pressed == btnOutput)
		{
			JFileChooser fc = new JFileChooser();
			fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
			int returnVal = fc.showOpenDialog(null);
			if(returnVal == JFileChooser.APPROVE_OPTION)
			{
				outputFolder = fc.getSelectedFile();
				label.setText(outputFolder.getAbsolutePath());
			}
		}
		else if(pressed == btnRenderAll)
		{
			if(comboBox_1.getSelectedIndex()==0)JOptionPane.showMessageDialog(null, "Must Select Sort Method");
			else if(outputFolder==null)JOptionPane.showMessageDialog(null, "Must select output Folder");
			else
			{
				RenderLeague render = new RenderLeague(leagueGUI.job,players, leagueGUI.schoolPath,
						outputFolder.getAbsolutePath(),comboBox.getSelectedIndex(),comboBox_1.getSelectedIndex(),this,chckbxRenderOutLabels.isSelected());
				renderThread = new Thread(render);
				renderThread.start();
			}
			
		}
		else if(pressed == btnRenderSelectedIn)
		{
			if(comboBox_1.getSelectedIndex()==0)JOptionPane.showMessageDialog(null, "Must Select Sort Method");
			else if(outputFolder==null)JOptionPane.showMessageDialog(null, "Must select output Folder");
			else
			{
				RenderLeague render = new RenderLeague(leagueGUI.job,leagueGUI.getSelectedPlayers(), leagueGUI.schoolPath,
						outputFolder.getAbsolutePath(),comboBox.getSelectedIndex(),comboBox_1.getSelectedIndex(),this,chckbxRenderOutLabels.isSelected());
				renderThread = new Thread(render);
				renderThread.start();
			}
		}
		
	}

}
