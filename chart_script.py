import plotly.graph_objects as go

# Data for blood shortage gap (in millions)
labels = ['Current Supply', 'Shortage']
values = [12.5, 2.1]
colors = ['#1FB8CD', '#DB4545']  # Strong cyan for supply, Bright red for shortage

# Create pie chart with custom text
fig = go.Figure(data=[go.Pie(
    labels=labels,
    values=values,
    marker_colors=colors,
    textinfo='label+percent+value',
    texttemplate='%{label}<br>%{value}M units<br>%{percent}',
    textposition='inside',
    hovertemplate='%{label}: %{value}M units<br>%{percent}<extra></extra>'
)])

# Update layout with better legend positioning
fig.update_layout(
    title='India Blood Supply Gap (14.6M Required)',
    uniformtext_minsize=14, 
    uniformtext_mode='hide',
    legend=dict(
        orientation='h', 
        yanchor='bottom', 
        y=1.05, 
        xanchor='center', 
        x=0.5
    )
)

# Save the chart
fig.write_image('blood_shortage_pie.png')