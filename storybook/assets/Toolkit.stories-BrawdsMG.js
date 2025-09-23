import{j as o}from"./iframe-Ca7Z-L4G.js";import{c as e}from"./plugin-BeYxo7k0.js";import{S as l}from"./Grid-auHuq8r2.js";import{C as m}from"./ComponentAccordion-2anxFCYS.js";import{w as a}from"./appWrappers-DRvX8LbQ.js";import{T as i}from"./TemplateBackstageLogoIcon-dzjwnp1B.js";import{I as s}from"./InfoCard-6yqF4ElN.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-C1QQDTm-.js";import"./componentData-_1Qfjr2u.js";import"./useAnalytics-B4tVP_DV.js";import"./useApp-CAw2wdK9.js";import"./useRouteRef-DDQzGExo.js";import"./index-BJKCiffA.js";import"./DialogTitle-CdHDbEvu.js";import"./Modal-DgmZg7sP.js";import"./Portal-BioI0xEQ.js";import"./Backdrop-DXmAjQVD.js";import"./Button-C4GDJaSU.js";import"./useObservable-DntrMzpR.js";import"./useIsomorphicLayoutEffect-C-EeS4cl.js";import"./ExpandMore-CMMWGbBw.js";import"./AccordionDetails-CcpJ8mhZ.js";import"./index-DnL3XN75.js";import"./Collapse-n2Kb8itc.js";import"./useAsync-DSkJAg62.js";import"./useMountedState-CV_rLf93.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BzSwagcs.js";import"./ErrorBoundary-DMJmqIzN.js";import"./ErrorPanel-zLmvMY6B.js";import"./WarningPanel-DU1kckLo.js";import"./MarkdownContent-CoRCbhDs.js";import"./CodeSnippet-BKse1xIH.js";import"./Box-BAIj98gt.js";import"./styled-C18e2gIS.js";import"./CopyTextButton-DcJl0ww3.js";import"./useCopyToClipboard-vqdrk62a.js";import"./Tooltip-BxH5cU7h.js";import"./Popper-BHTXlPRY.js";import"./List-CZA5eH2K.js";import"./ListContext-B_Im9Dn6.js";import"./ListItem-C9nJC85u.js";import"./ListItemText-DZSn-Gas.js";import"./LinkButton-BKXHaC2U.js";import"./Link-D6f9g5gT.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-C6vdyhr0.js";import"./Divider-zG-YiM3h.js";import"./CardActions-DoALoamq.js";import"./BottomLink-By8FPf_G.js";import"./ArrowForward-DUXpUVfv.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
