import{j as o}from"./iframe-Vo5gUnCl.js";import{c as e}from"./plugin-lMVp93OZ.js";import{S as l}from"./Grid-BEftOOde.js";import{C as m}from"./ComponentAccordion-Dwvm0UJ0.js";import{w as a}from"./appWrappers-DRnMogOg.js";import{T as i}from"./TemplateBackstageLogoIcon-Cr5di8au.js";import{I as s}from"./InfoCard-CoEudecg.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BR2getLG.js";import"./componentData-CM3E1gm5.js";import"./useAnalytics-DHo0n9fb.js";import"./useApp-ByJEk4p0.js";import"./useRouteRef-P8yf-IQ-.js";import"./index-CkzVBa0W.js";import"./DialogTitle-BVpOivUt.js";import"./Modal-Ccymkcf6.js";import"./Portal-D4JBSn9P.js";import"./Backdrop-tN9AW69-.js";import"./Button-Cn1hZ8HW.js";import"./useObservable-Cde_jjGr.js";import"./useIsomorphicLayoutEffect-DzFgYOQ-.js";import"./ExpandMore-D0AdZzXp.js";import"./AccordionDetails-7QWkCXyJ.js";import"./index-B9sM2jn7.js";import"./Collapse-UgyrRMk3.js";import"./useAsync-DeuSsByy.js";import"./useMountedState-Bh-KE1Jd.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CWdtLCwL.js";import"./ErrorBoundary-vSmrrcxN.js";import"./ErrorPanel-CECY8d1j.js";import"./WarningPanel-3Yi5HVAk.js";import"./MarkdownContent-C2NiFE4k.js";import"./CodeSnippet-D6VjBC0k.js";import"./Box-DxK1aAZk.js";import"./styled-DKP2AsJk.js";import"./CopyTextButton-3h_uNDP1.js";import"./useCopyToClipboard-D18fnjgX.js";import"./Tooltip-CrljWSzR.js";import"./Popper-xVSLGgcC.js";import"./List-DaH1cfBf.js";import"./ListContext-CeAVa15U.js";import"./ListItem-C_bA5RtL.js";import"./ListItemText-DwHyTgsb.js";import"./LinkButton-BVapmrqz.js";import"./Link-C_eXFj6m.js";import"./lodash-Czox7iJy.js";import"./CardHeader-DNxPOFVY.js";import"./Divider-CM863GtP.js";import"./CardActions-C5WgvvEj.js";import"./BottomLink-B0-zVqyZ.js";import"./ArrowForward-0a0C5lHr.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
