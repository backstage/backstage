import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-BDvXWqMv.js";import{s as g,H as u}from"./plugin-C9fKKw56.js";import{c as h}from"./api-YcO_8kG0.js";import{c as f}from"./catalogApiMock-Do1PRX-b.js";import{s as x}from"./api-D4OhEijw.js";import{S as y}from"./SearchContext-C1PZ8VcQ.js";import{P as S}from"./Page-X5o4nDAe.js";import{S as r}from"./Grid-SEE3Vji4.js";import{b as k,a as j,c as C}from"./plugin-Z2ZPAbRk.js";import{T as P}from"./TemplateBackstageLogo-2IXvXge2.js";import{T as I}from"./TemplateBackstageLogoIcon-CxTNTbfC.js";import{e as T}from"./routes-Db30jStx.js";import{w as v}from"./appWrappers-D7GkfUM0.js";import{s as G}from"./StarredEntitiesApi-Cn7pCgMw.js";import{M as A}from"./MockStarredEntitiesApi-DxYwKFsk.js";import{I as B}from"./InfoCard-DuIbSHrf.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DtnGOx-Y.js";import"./Plugin-6Gt6crr0.js";import"./componentData-8WYIPpYM.js";import"./useAnalytics-Bhj43Yb4.js";import"./useApp-XW1Y_59p.js";import"./useRouteRef-BNT0Uji7.js";import"./index-CuoyrUh2.js";import"./lodash-DTh7qDqK.js";import"./ref-C0VTUPuL.js";import"./useAsync-CZTayVe5.js";import"./useMountedState-DRPCbnV1.js";import"./DialogTitle-DbfnWxYL.js";import"./Modal-aUjOD6G2.js";import"./Portal-Bxsqc2Ff.js";import"./Backdrop-DQKzqBN9.js";import"./Button-D_oOYcjF.js";import"./useObservable-C5WBInFh.js";import"./useIsomorphicLayoutEffect-Ckaa7XZb.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-ByGsH1mf.js";import"./ErrorBoundary-Cmwdx4oo.js";import"./ErrorPanel-DIJrYilU.js";import"./WarningPanel-B6FaAcan.js";import"./ExpandMore-D0gsRd1g.js";import"./AccordionDetails-Dl8lH0s0.js";import"./index-B9sM2jn7.js";import"./Collapse-CyX3uF1t.js";import"./MarkdownContent-CH9QtLal.js";import"./CodeSnippet-CRyXuPAV.js";import"./Box-BU77o5ge.js";import"./styled-Dje9scF9.js";import"./CopyTextButton-Bw_MRs6O.js";import"./useCopyToClipboard-CKArlyoH.js";import"./Tooltip-La5U8gro.js";import"./Popper-CBqxIWf4.js";import"./List-BCScUoZK.js";import"./ListContext-BMD4k7rh.js";import"./ListItem-DtJ6NXng.js";import"./ListItemText-BChUSAmp.js";import"./LinkButton-CGPFeLQh.js";import"./Link-OHorDb2O.js";import"./CardHeader-D5WvCsB_.js";import"./Divider-BVTElTLB.js";import"./CardActions-BCLarAT5.js";import"./BottomLink-CnwY1COn.js";import"./ArrowForward-B0ytsCDP.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Ft as default};
