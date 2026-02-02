import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-DDK8UA9d.js";import{s as g,H as u}from"./plugin-DaAq7n4T.js";import{c as h}from"./api-D4XXIQOE.js";import{c as f}from"./catalogApiMock-m1oNyg0r.js";import{s as x}from"./api-CGIL2G7j.js";import{S as y}from"./SearchContext-Bv9Kt0lg.js";import{P as S}from"./Page-Da9rv8DJ.js";import{S as r}from"./Grid-D0K-a10_.js";import{b as k,a as j,c as C}from"./plugin-vSac1J8y.js";import{T as P}from"./TemplateBackstageLogo-CVX93oY6.js";import{T as I}from"./TemplateBackstageLogoIcon-B7DoyYdV.js";import{e as T}from"./routes-DmrI4D1K.js";import{w as v}from"./appWrappers-BAKca1UY.js";import{s as G}from"./StarredEntitiesApi-DGWXkp_7.js";import{M as A}from"./MockStarredEntitiesApi-B2K3n_ix.js";import{I as B}from"./InfoCard-DdFVwzRm.js";import"./preload-helper-PPVm8Dsz.js";import"./index-H-HdDpAn.js";import"./Plugin-B8rIXpyP.js";import"./componentData-DVCIxwRf.js";import"./useAnalytics-BzcY6zQX.js";import"./useApp-CEEPe1BL.js";import"./useRouteRef-B6R72X7Y.js";import"./index-BCCOFm5P.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-Cu7_HYMF.js";import"./useMountedState-Dd9a9K3Q.js";import"./DialogTitle-BTPhbLnL.js";import"./Modal-BvYRzzOq.js";import"./Portal-DcnhuCwR.js";import"./Backdrop-Dzo24YRx.js";import"./Button-BX1FqlVG.js";import"./useObservable-lrBRJVS5.js";import"./useIsomorphicLayoutEffect-DQLGKQw-.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-D3M8ALUj.js";import"./ErrorBoundary-DfU1mqPq.js";import"./ErrorPanel-BQD939bd.js";import"./WarningPanel-DXNyXfzl.js";import"./ExpandMore-BnojTJh7.js";import"./AccordionDetails-BmHvpTHX.js";import"./index-B9sM2jn7.js";import"./Collapse-Bm6nVpbB.js";import"./MarkdownContent-CG88u8fu.js";import"./CodeSnippet-DWhhZEwi.js";import"./Box-DhjbYf3r.js";import"./styled-DMKPGzcT.js";import"./CopyTextButton-Chq4JcN0.js";import"./useCopyToClipboard-DbGzp7uW.js";import"./Tooltip-Cy4RFEYG.js";import"./Popper-BHoeK-6N.js";import"./List-DFzXqQTw.js";import"./ListContext-Gb2XOrAs.js";import"./ListItem-DLPNurIO.js";import"./ListItemText-C4llEuCJ.js";import"./LinkButton-Szn1P8QE.js";import"./Link-D2O1VvQJ.js";import"./CardHeader-DKd_bJm5.js";import"./Divider-b4tOLF1T.js";import"./CardActions-CMH4xMES.js";import"./BottomLink-DGft6KEe.js";import"./ArrowForward-Dp8lxvtT.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
