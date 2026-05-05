import{j as t,W as d,a3 as u,a2 as h}from"./iframe-D7zjeBit.js";import{r as g}from"./plugin-B8dYERQm.js";import{S as l,u as n,a as x}from"./useSearchModal-BGNQ3zPg.js";import{B as c}from"./Button-C2qUSh9P.js";import{D as S,a as f,b as M}from"./DialogTitle-DLrpVfbl.js";import{B as j}from"./Box-eqPq7tDA.js";import{S as r}from"./Grid-BwBMybgh.js";import{S as C}from"./SearchType-C9ZhJYOT.js";import{L as y}from"./List-_IcS7A5z.js";import{H as I}from"./DefaultResultListItem-Dn9oyKrS.js";import{w as R}from"./appWrappers-v5wpWIMC.js";import{m as B}from"./makeStyles-BdLugvEp.js";import{s as D,M as k}from"./api-CCo5-scy.js";import{S as v}from"./SearchContext-D2vdUOrz.js";import{SearchBar as T}from"./SearchBar-lMogXDrl.js";import{S as b}from"./SearchResult-C1UPkB0z.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bbpa25qa.js";import"./Plugin-CVC2XCl_.js";import"./componentData-oJphk98C.js";import"./useAnalytics-CJoDpLKX.js";import"./useApp-CAJtRMT4.js";import"./useRouteRef-D3pL_24l.js";import"./ArrowForward-CiBVcspR.js";import"./translation-CciJukug.js";import"./Page-n6e5XJVR.js";import"./useMediaQuery-C_vpzr4_.js";import"./Divider-B8mQbTru.js";import"./ArrowBackIos-DiKGXZZ5.js";import"./ArrowForwardIos-BgNCx0DV.js";import"./translation-B9ufI9Ns.js";import"./Modal-CKF7dnop.js";import"./Portal-B4c0pg-w.js";import"./Backdrop-24biQHBz.js";import"./styled-Cto7NXi2.js";import"./ExpandMore-CHCoKjrA.js";import"./useAsync-Dqyaj-jN.js";import"./useMountedState-kWf6Idih.js";import"./AccordionDetails-yQUU3RTP.js";import"./index-B9sM2jn7.js";import"./Collapse-CIrQlr20.js";import"./ListItem-PR8H70fv.js";import"./ListContext-338I8pjt.js";import"./ListItemIcon-DY3Cfta7.js";import"./ListItemText-vMMeAjTD.js";import"./Tabs-CdZGL-kK.js";import"./KeyboardArrowRight-IfS9RgkQ.js";import"./FormLabel-De5-AHD7.js";import"./formControlState-Be-np0TU.js";import"./InputLabel-DwExugKT.js";import"./Select-BW0qQiBP.js";import"./Popover-BLVU7E1s.js";import"./MenuItem-RejvdPIb.js";import"./Checkbox-DhSSoNPx.js";import"./SwitchBase-DEr-BGOx.js";import"./Chip-BBqdvmfX.js";import"./Link-43gYvX88.js";import"./index-B9TfV-iv.js";import"./lodash-CaiQO1ZN.js";import"./WebStorage-DeZ4yBfj.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DYeGzQbF.js";import"./useIsomorphicLayoutEffect-yTyQWuiq.js";import"./BUIProvider-C7yMSiFt.js";import"./openLink-Cd2W8V43.js";import"./useResolvedHref-CxiGpWC6.js";import"./Search-B-bvnqNS.js";import"./useDebounce-D1JeTaUY.js";import"./InputAdornment-jNfe_NPb.js";import"./TextField-DKGiz5iZ.js";import"./useElementFilter-CPgQI5iw.js";import"./EmptyState-DxbABYLa.js";import"./Progress-Bj4ZZPqW.js";import"./LinearProgress-CuFzMvnp.js";import"./ResponseErrorPanel-CX6I3Nps.js";import"./ErrorPanel-D3lennx9.js";import"./WarningPanel-CcoG20un.js";import"./MarkdownContent-DiO1cZeN.js";import"./CodeSnippet-hV1f9Dn9.js";import"./CopyTextButton-Z9HYJ3cw.js";import"./useCopyToClipboard-CckL3d_D.js";import"./Tooltip-uVb4gd3h.js";import"./Popper-CEBtOcEQ.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...s.parameters?.docs?.source}}};const po=["Default","CustomModal"];export{s as CustomModal,i as Default,po as __namedExportsOrder,co as default};
