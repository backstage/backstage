import{j as o}from"./iframe-B6vHPHUS.js";import{c as e}from"./plugin-Cr81OckD.js";import{S as l}from"./Grid-BHnfM9BN.js";import{C as m}from"./ComponentAccordion-CGsyOEZS.js";import{w as a}from"./appWrappers-m0dyImYt.js";import{T as i}from"./TemplateBackstageLogoIcon-BpH07E5q.js";import{I as s}from"./InfoCard-Dl82Ld7M.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-uDhfna-s.js";import"./componentData-Ck-liOWv.js";import"./useAnalytics-CHRs9F0l.js";import"./useApp-c9Cmx9JK.js";import"./useRouteRef-_QxqMNzn.js";import"./index-CG8HQpK_.js";import"./DialogTitle-B91uUjY7.js";import"./Modal-BadxeSQ1.js";import"./Portal-DQJrkvBY.js";import"./Backdrop-khO5dm31.js";import"./Button-CJpRzj7y.js";import"./useObservable-Cj9WRojc.js";import"./useIsomorphicLayoutEffect-CWw7s17H.js";import"./ExpandMore-B0SFV6c5.js";import"./AccordionDetails-B-VwfNtv.js";import"./index-DnL3XN75.js";import"./Collapse-CIMX6SDT.js";import"./useAsync-CtKW-R0u.js";import"./useMountedState-4spEAOpb.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-DSCKd1_n.js";import"./ErrorBoundary-Crn6Mezf.js";import"./ErrorPanel-B64V3zAe.js";import"./WarningPanel-C9caxC0h.js";import"./MarkdownContent-D1AHxM79.js";import"./CodeSnippet-CV4g9JLu.js";import"./Box-BsuLuKk6.js";import"./styled-BNzka1pC.js";import"./CopyTextButton-DuiMHNoR.js";import"./useCopyToClipboard-DyRiVU--.js";import"./Tooltip-BKT0sHqR.js";import"./Popper-0ce0RW6i.js";import"./List-C19QDRq1.js";import"./ListContext-D8DpMZfT.js";import"./ListItem-BxDrZyrD.js";import"./ListItemText-BE9Uflaf.js";import"./LinkButton-DwUDlPmx.js";import"./Link-BCwjV0MZ.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-YOBkbVrI.js";import"./Divider-PYX69q2N.js";import"./CardActions-C0mZmhjb.js";import"./BottomLink-CNa6Jzbq.js";import"./ArrowForward-B1fZSS8q.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
