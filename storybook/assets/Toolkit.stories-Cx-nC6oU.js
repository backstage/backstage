import{j as o}from"./iframe-mdeHk8Us.js";import{c as e}from"./plugin-BVcbV0Ox.js";import{S as l}from"./Grid-DC2Tywm3.js";import{C as m}from"./ComponentAccordion-CXZqFJyT.js";import{w as a}from"./appWrappers-BH9LHHFZ.js";import{T as i}from"./TemplateBackstageLogoIcon-B26iY4Tf.js";import{I as s}from"./InfoCard-DYz9dhWP.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BR79PUs9.js";import"./componentData-DyMAqMyS.js";import"./useAnalytics-Cte0NGRl.js";import"./useApp-DWNk4MUY.js";import"./useRouteRef-BPPz61H3.js";import"./index-DhB3CqmG.js";import"./DialogTitle-CmcGNy32.js";import"./Modal-uDaBb03U.js";import"./Portal-CGi5eRlN.js";import"./Backdrop-B1KztC8w.js";import"./Button-DaFlKZgy.js";import"./useObservable-BYYos0JC.js";import"./useIsomorphicLayoutEffect-Bz91LDOF.js";import"./ExpandMore-4uaBqvpS.js";import"./AccordionDetails-CY4b5vf9.js";import"./index-B9sM2jn7.js";import"./Collapse-B45VguHP.js";import"./useAsync-DlW7WdkC.js";import"./useMountedState-DqT-X8D-.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-D1IhYZuq.js";import"./ErrorBoundary-BLGxg7ja.js";import"./ErrorPanel-De8J-gDX.js";import"./WarningPanel-Cg3FNdiM.js";import"./MarkdownContent-DOJrLrbX.js";import"./CodeSnippet-DzFJqA_2.js";import"./Box-C_VvrdzU.js";import"./styled-BGP2DNJW.js";import"./CopyTextButton-BqpZzKnD.js";import"./useCopyToClipboard-DVW_Y7r9.js";import"./Tooltip-BRtijnu7.js";import"./Popper-D5LaxFiz.js";import"./List-X7Jezm93.js";import"./ListContext-EwKgne2S.js";import"./ListItem-L1zDUeu9.js";import"./ListItemText-DCPofTJa.js";import"./LinkButton-CSGY2AO6.js";import"./Link-dvajx9JY.js";import"./lodash-Czox7iJy.js";import"./CardHeader-ByJ2FETy.js";import"./Divider-GxHdmRdJ.js";import"./CardActions-C4694dyD.js";import"./BottomLink-BPrh7zn-.js";import"./ArrowForward-BEuLEQbk.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
