import{j as o}from"./iframe-DPEQU9sg.js";import{c as e}from"./plugin-CiOkNlA6.js";import{S as l}from"./Grid-V2KC8DrR.js";import{C as m}from"./ComponentAccordion-lwIhYkYN.js";import{w as a}from"./appWrappers-Bk2njHpK.js";import{T as i}from"./TemplateBackstageLogoIcon-zz61EbM3.js";import{I as s}from"./InfoCard-UXrjSJZz.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Dd2xY8WF.js";import"./componentData-DiYtav-w.js";import"./useAnalytics-odk5YTGP.js";import"./useApp-WY7YhADn.js";import"./useRouteRef-PDyeC6uZ.js";import"./index-9w1oJKxU.js";import"./DialogTitle-8oe1SRUv.js";import"./Modal-BY3dMB2D.js";import"./Portal-AonZoDqn.js";import"./Backdrop-BZwF8N70.js";import"./Button-B3E66A3B.js";import"./useObservable-Bl5WmSl_.js";import"./useIsomorphicLayoutEffect-8D8X83kR.js";import"./ExpandMore-D_QIxzGY.js";import"./AccordionDetails-0XhIBkyu.js";import"./index-B9sM2jn7.js";import"./Collapse-ggEsDBaY.js";import"./useAsync-BqETPqxv.js";import"./useMountedState-BqkaBMSv.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BpROYwkn.js";import"./ErrorBoundary--PVZ3Kye.js";import"./ErrorPanel-Bv595yjm.js";import"./WarningPanel-C_F8xUzg.js";import"./MarkdownContent-D28GpyhI.js";import"./CodeSnippet-DGpkezw4.js";import"./Box-DFPXS1uh.js";import"./styled-_ZhQ2JBl.js";import"./CopyTextButton-CyVbES63.js";import"./useCopyToClipboard-D4G45ymZ.js";import"./Tooltip-1rkaBdpM.js";import"./Popper-BxGyCUHY.js";import"./List-DquDfnLJ.js";import"./ListContext-DyGfW3pa.js";import"./ListItem-C3tAmyko.js";import"./ListItemText-xJVltyzR.js";import"./LinkButton-BMSs3eBp.js";import"./Link-DnuEQx-0.js";import"./lodash-Czox7iJy.js";import"./CardHeader-CcWBi4cR.js";import"./Divider-DubjQnze.js";import"./CardActions-CpqUN02Z.js";import"./BottomLink-DBqGzdk2.js";import"./ArrowForward-B3AD257j.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
