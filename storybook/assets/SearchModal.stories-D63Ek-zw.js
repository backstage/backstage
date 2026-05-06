import{j as t,W as d,a3 as u,a2 as h}from"./iframe-CwGYDpYH.js";import{r as g}from"./plugin-CdEJOMVL.js";import{S as l,u as n,a as x}from"./useSearchModal-BaignAc4.js";import{B as c}from"./Button-i77kpIMD.js";import{D as S,a as f,b as M}from"./DialogTitle-ChlvFsVr.js";import{B as j}from"./Box-DK8SMPjv.js";import{S as r}from"./Grid-D9pxZO34.js";import{S as C}from"./SearchType-ClRGY46R.js";import{L as y}from"./List-D7ewfho0.js";import{H as I}from"./DefaultResultListItem-BkqQn6o1.js";import{w as R}from"./appWrappers-ioq0ti9t.js";import{m as B}from"./makeStyles-B-7ejBjc.js";import{s as D,M as k}from"./api-MlTUZf_X.js";import{S as v}from"./SearchContext-DqrLN0i3.js";import{SearchBar as T}from"./SearchBar-CuLCEBif.js";import{S as b}from"./SearchResult-DBM51zwW.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BP4B84GF.js";import"./Plugin-BH133EJ2.js";import"./componentData-DSzXRFfR.js";import"./useAnalytics-Bir4eJYF.js";import"./useApp-hwqbTLFx.js";import"./useRouteRef-xXlqYEzJ.js";import"./ArrowForward-pstlmdeK.js";import"./translation-jUxrB-rc.js";import"./Page-DL8DvhDy.js";import"./useMediaQuery-DbCbp13j.js";import"./Divider-CRsARYGl.js";import"./ArrowBackIos-DkzUHfBG.js";import"./ArrowForwardIos-C9bUXbK1.js";import"./translation-4GGpH6vT.js";import"./Modal-CdGZYRSs.js";import"./Portal-ChQ23K-b.js";import"./Backdrop-BXgBqslP.js";import"./styled-Bo4D4TjS.js";import"./ExpandMore-C1vGF3Td.js";import"./useAsync-BYRlsE8D.js";import"./useMountedState-DGAu4OuG.js";import"./AccordionDetails-AiT2KCk_.js";import"./index-B9sM2jn7.js";import"./Collapse-BaMd2IqY.js";import"./ListItem-a-yOdytX.js";import"./ListContext-B7RocSCf.js";import"./ListItemIcon-sezQI81T.js";import"./ListItemText-DX5F26PV.js";import"./Tabs-Br3stS8r.js";import"./KeyboardArrowRight-B5KJLHGw.js";import"./FormLabel-DCZuBaR_.js";import"./formControlState-DknsCqdz.js";import"./InputLabel-CAzwx5jT.js";import"./Select-K16B8imw.js";import"./Popover-BzcVWMMN.js";import"./MenuItem-ZrSdN3hC.js";import"./Checkbox-BzUXY4lZ.js";import"./SwitchBase-BRn6SGzW.js";import"./Chip-C7BRFe2B.js";import"./Link-CswoIIi-.js";import"./index-fEpbvEIU.js";import"./lodash-DVkgycFV.js";import"./WebStorage-CI04uxRe.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-RUz3cz4T.js";import"./useIsomorphicLayoutEffect-GLlfoH7M.js";import"./BUIProvider-BSpClcjO.js";import"./openLink-Ds4I99G_.js";import"./useResolvedHref-ByF3i79N.js";import"./Search-BcEy68Np.js";import"./useDebounce-BZyNnU6q.js";import"./InputAdornment-CXQBCHqZ.js";import"./TextField-BpGTniRa.js";import"./useElementFilter-uG_KMSO6.js";import"./EmptyState-DXg4uIvq.js";import"./Progress-56UonF48.js";import"./LinearProgress-8yq0ZjYZ.js";import"./ResponseErrorPanel-BbphKlgE.js";import"./ErrorPanel-51u8WX4S.js";import"./WarningPanel-5ArBzLiS.js";import"./MarkdownContent-sJutuZpy.js";import"./CodeSnippet-CAWaV5he.js";import"./CopyTextButton-CafBm5cp.js";import"./useCopyToClipboard-Dl6M58F9.js";import"./Tooltip-0URE30Se.js";import"./Popper-B-_f95Yk.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
