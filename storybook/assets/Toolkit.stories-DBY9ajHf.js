import{j as o}from"./iframe-DDK8UA9d.js";import{c as e}from"./plugin-vSac1J8y.js";import{S as l}from"./Grid-D0K-a10_.js";import{C as m}from"./ComponentAccordion-BfxV3Coh.js";import{w as a}from"./appWrappers-BAKca1UY.js";import{T as i}from"./TemplateBackstageLogoIcon-B7DoyYdV.js";import{I as s}from"./InfoCard-DdFVwzRm.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-B8rIXpyP.js";import"./componentData-DVCIxwRf.js";import"./useAnalytics-BzcY6zQX.js";import"./useApp-CEEPe1BL.js";import"./useRouteRef-B6R72X7Y.js";import"./index-BCCOFm5P.js";import"./DialogTitle-BTPhbLnL.js";import"./Modal-BvYRzzOq.js";import"./Portal-DcnhuCwR.js";import"./Backdrop-Dzo24YRx.js";import"./Button-BX1FqlVG.js";import"./useObservable-lrBRJVS5.js";import"./useIsomorphicLayoutEffect-DQLGKQw-.js";import"./ExpandMore-BnojTJh7.js";import"./AccordionDetails-BmHvpTHX.js";import"./index-B9sM2jn7.js";import"./Collapse-Bm6nVpbB.js";import"./useAsync-Cu7_HYMF.js";import"./useMountedState-Dd9a9K3Q.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-D3M8ALUj.js";import"./ErrorBoundary-DfU1mqPq.js";import"./ErrorPanel-BQD939bd.js";import"./WarningPanel-DXNyXfzl.js";import"./MarkdownContent-CG88u8fu.js";import"./CodeSnippet-DWhhZEwi.js";import"./Box-DhjbYf3r.js";import"./styled-DMKPGzcT.js";import"./CopyTextButton-Chq4JcN0.js";import"./useCopyToClipboard-DbGzp7uW.js";import"./Tooltip-Cy4RFEYG.js";import"./Popper-BHoeK-6N.js";import"./List-DFzXqQTw.js";import"./ListContext-Gb2XOrAs.js";import"./ListItem-DLPNurIO.js";import"./ListItemText-C4llEuCJ.js";import"./LinkButton-Szn1P8QE.js";import"./Link-D2O1VvQJ.js";import"./lodash-Czox7iJy.js";import"./CardHeader-DKd_bJm5.js";import"./Divider-b4tOLF1T.js";import"./CardActions-CMH4xMES.js";import"./BottomLink-DGft6KEe.js";import"./ArrowForward-Dp8lxvtT.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
