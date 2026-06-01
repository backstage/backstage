import{bR as t,u as d,l as u,a5 as h}from"./iframe-CHEWuc0v.js";import{r as g}from"./plugin-z6zVXAAB.js";import{S as m,u as n,b as x}from"./useSearchModal-BgoRFRuY.js";import{B as c}from"./Button-CuEp1VFU.js";import{c as S,b as f,a as M}from"./DialogTitle-CjYB4bbL.js";import{B as j}from"./Box-CA5r6KPw.js";import{S as r}from"./Grid-DIzjM6gG.js";import{S as C}from"./SearchType-zbAXVpjZ.js";import{L as y}from"./List-Htl-iPuO.js";import{H as R}from"./DefaultResultListItem-CjuQSp_w.js";import{O as I}from"./appWrappers-DcGgSea5.js";import{m as B}from"./makeStyles-CcHkTlxf.js";import{s as D,M as b}from"./api-5vU0dLmk.js";import{S as k}from"./SearchContext-B-lYn_Ub.js";import{SearchBar as v}from"./SearchBar-Dke-2o7K.js";import{S as T}from"./SearchResult-mNvys203.js";import"./preload-helper-PPVm8Dsz.js";import"./index-uuu6IEHm.js";import"./Plugin-CQVdlf20.js";import"./componentData-c5-e4hz-.js";import"./useAnalytics-BWLaGjRK.js";import"./useApp-ezEKjyT8.js";import"./useRouteRef-CE3wQCvm.js";import"./ArrowForward-BfA2_ANj.js";import"./translation-Dtl2YkGF.js";import"./Page-COP2zd30.js";import"./useMediaQuery-QlczwV2o.js";import"./Divider-DHi8Uy4i.js";import"./ArrowBackIos-_Psls4KY.js";import"./ArrowForwardIos-Buvouy_P.js";import"./translation-BORvbOqj.js";import"./Modal-BrlKAJmB.js";import"./Portal-CXDFFVA9.js";import"./Backdrop-D-RFqu1K.js";import"./styled-B0xaf2Nd.js";import"./ExpandMore-BW4q8rK6.js";import"./useAsync-DlQJ5xIa.js";import"./useMountedState-omtJmy7S.js";import"./AccordionDetails-CO5Ln29w.js";import"./index-B9sM2jn7.js";import"./Collapse--1rIDwXS.js";import"./ListItem-Djh9MDE8.js";import"./ListContext-Db_fj7kn.js";import"./ListItemIcon-DpIRybrw.js";import"./ListItemText-CmJpp866.js";import"./Tabs-cGW0bkil.js";import"./KeyboardArrowRight-C2RZ26a8.js";import"./FormLabel-Ooeappsz.js";import"./formControlState-DPMopBGe.js";import"./InputLabel-ClorDRfc.js";import"./Select-B-kmcnDo.js";import"./Popover-D1Qvnejf.js";import"./MenuItem-BOH2HQiJ.js";import"./Checkbox-DB4Zz2ul.js";import"./SwitchBase-2bcPu4TR.js";import"./Chip-DcSz9Fb8.js";import"./Link-DiivKN7j.js";import"./index-D8aRAqEX.js";import"./lodash-WdvZzfTd.js";import"./WebStorage-BR4xObUn.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-DJMYjNwj.js";import"./useIsomorphicLayoutEffect-DMf488mO.js";import"./BUIProvider-DyKAZv7q.js";import"./openLink-BiHhgp--.js";import"./useResolvedHref-BQ5vFI9O.js";import"./Search-DcxIUPn7.js";import"./useDebounce-BO2gE5t_.js";import"./InputAdornment-BPkuacRg.js";import"./TextField-DdmvwYsx.js";import"./useElementFilter-DF6Xj5K8.js";import"./EmptyState-BWo5rdU_.js";import"./Progress-CukfYDZ0.js";import"./LinearProgress-DsreimD_.js";import"./ResponseErrorPanel-DCt3_2Uh.js";import"./ErrorPanel-CF_5eQEj.js";import"./WarningPanel-DW4M9vNo.js";import"./MarkdownContent-BdSF0F5o.js";import"./CodeSnippet-CCvE8kV-.js";import"./CopyTextButton-C4Na4Oiw.js";import"./useCopyToClipboard-BQ7lxDJ3.js";import"./Tooltip-D_wlfMrX.js";import"./Popper-DpXbhq_0.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
