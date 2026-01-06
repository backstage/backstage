import{j as o}from"./iframe-nUyzSU_S.js";import{c as e}from"./plugin-CYJstFDm.js";import{S as l}from"./Grid-DwDNjNmk.js";import{C as m}from"./ComponentAccordion-BLV0-Uv3.js";import{w as a}from"./appWrappers-uUi70V5A.js";import{T as i}from"./TemplateBackstageLogoIcon-BmnX-Jc7.js";import{I as s}from"./InfoCard-DSeh5j0l.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BL-ThqI6.js";import"./componentData-BtNz5bOU.js";import"./useAnalytics-zfcNJTQf.js";import"./useApp-BPL8rQQ0.js";import"./useRouteRef-DTrAK6VX.js";import"./index-RHyzx4fN.js";import"./DialogTitle-CrBmctvX.js";import"./Modal-CyZtSQZC.js";import"./Portal-B4a8gD0I.js";import"./Backdrop-D6as2G6O.js";import"./Button-9eN5S7Qm.js";import"./useObservable-D1hu37r5.js";import"./useIsomorphicLayoutEffect-DDHF-UnU.js";import"./ExpandMore-DrwTQ_nT.js";import"./AccordionDetails-BqLvXOa3.js";import"./index-B9sM2jn7.js";import"./Collapse-Qq71ZV2-.js";import"./useAsync-D2jbTAhU.js";import"./useMountedState-Ck7bTrxM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-DWcWYjWe.js";import"./ErrorBoundary-CNX_z6P8.js";import"./ErrorPanel-Dv6LBRqb.js";import"./WarningPanel-T0yxH3Lf.js";import"./MarkdownContent-CmKSX4Zr.js";import"./CodeSnippet-DiaoCVk2.js";import"./Box-CplorJ0g.js";import"./styled-D6A2oy1q.js";import"./CopyTextButton--QRyALeY.js";import"./useCopyToClipboard-CaxGIeMo.js";import"./Tooltip-HC5n3ZHa.js";import"./Popper-DpFVguQf.js";import"./List-D6JW15z2.js";import"./ListContext-CXea3Vhu.js";import"./ListItem-PgZpHMG5.js";import"./ListItemText-Bd0mukYB.js";import"./LinkButton-DJUqKcTh.js";import"./Link-Dwrts35l.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-CjXaRXp3.js";import"./Divider-B2c5GnvR.js";import"./CardActions-BHnQKqWp.js";import"./BottomLink-DLjeX_1_.js";import"./ArrowForward-CpJlCC58.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
