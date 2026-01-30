import{j as o}from"./iframe-q37i5wh7.js";import{c as e}from"./plugin-t88-RfOu.js";import{S as l}from"./Grid-C05v6eeb.js";import{C as m}from"./ComponentAccordion-sL3V7-mK.js";import{w as a}from"./appWrappers-COl_vAr6.js";import{T as i}from"./TemplateBackstageLogoIcon-BJTTBZdf.js";import{I as s}from"./InfoCard-Cd6HgPXU.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CB9fW_xb.js";import"./componentData-E9OYffVp.js";import"./useAnalytics-Qh0Z6cDc.js";import"./useApp-DRQlf20V.js";import"./useRouteRef-Dm0QmNOs.js";import"./index-4QSZcc7K.js";import"./DialogTitle-CtRkS27u.js";import"./Modal-TMOxKW-w.js";import"./Portal-Cg2yUny5.js";import"./Backdrop-CWK59iWf.js";import"./Button-DPiRNZXm.js";import"./useObservable-e6xV4JA9.js";import"./useIsomorphicLayoutEffect-BOIrCsYn.js";import"./ExpandMore-Dh8PJJ4O.js";import"./AccordionDetails-SWAG835D.js";import"./index-B9sM2jn7.js";import"./Collapse-EBwNTQD_.js";import"./useAsync-5U-iBZk2.js";import"./useMountedState-rIY5swUn.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CMtJW6TZ.js";import"./ErrorBoundary-DCLXQR6g.js";import"./ErrorPanel-F1yEZWbU.js";import"./WarningPanel-C_8iIf0P.js";import"./MarkdownContent-Cy41HZJg.js";import"./CodeSnippet-CLlJVEMw.js";import"./Box-COPOq1Uf.js";import"./styled-Cr1yRHHC.js";import"./CopyTextButton-D-U2fpdK.js";import"./useCopyToClipboard-DKocU9ZU.js";import"./Tooltip-1ydGyrcT.js";import"./Popper-KbPRvRer.js";import"./List-PIZxoj_p.js";import"./ListContext-CjbrLwST.js";import"./ListItem-CpM31wZi.js";import"./ListItemText-DrEGNqUi.js";import"./LinkButton-BWyYwHDi.js";import"./Link-VlZlHdCt.js";import"./lodash-Czox7iJy.js";import"./CardHeader-DxnZ9i-M.js";import"./Divider-DMqMfewh.js";import"./CardActions-CCEsNnC3.js";import"./BottomLink-BO513QD8.js";import"./ArrowForward-Bjdstcjo.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
