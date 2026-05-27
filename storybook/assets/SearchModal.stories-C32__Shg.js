import{j as t,W as d,a3 as u,a2 as h}from"./iframe-BNTyYmtG.js";import{r as g}from"./plugin-WTRzSuGZ.js";import{S as l,u as n,a as x}from"./useSearchModal-cYZ5Q6Qi.js";import{B as c}from"./Button-CxuSPj3T.js";import{D as S,a as f,b as M}from"./DialogTitle-0_TvLqyr.js";import{B as j}from"./Box-Kfk7RP33.js";import{S as r}from"./Grid-SLvQHwt_.js";import{S as C}from"./SearchType-D1CYm9Tr.js";import{L as y}from"./List-DAAs5hS0.js";import{H as I}from"./DefaultResultListItem-CGIVe-eS.js";import{w as R}from"./appWrappers-et7r2sl_.js";import{m as B}from"./makeStyles-BagILknn.js";import{s as D,M as k}from"./api-BLHAJk8y.js";import{S as v}from"./SearchContext-DqhiemtP.js";import{SearchBar as T}from"./SearchBar-B_OOo2Fu.js";import{S as b}from"./SearchResult-Cd0LrVnh.js";import"./preload-helper-PPVm8Dsz.js";import"./index-u1HilbjI.js";import"./Plugin-Bi_2AuJq.js";import"./componentData-CIEYkKVy.js";import"./useAnalytics-D95_uiv8.js";import"./useApp-rt0dQGpV.js";import"./useRouteRef-D78f__JM.js";import"./ArrowForward-B0IPL9h_.js";import"./translation-DIsWGaWG.js";import"./Page-CatkVWQC.js";import"./useMediaQuery-B-I8Jn-Y.js";import"./Divider-nglNhLOz.js";import"./ArrowBackIos-D2qCd28z.js";import"./ArrowForwardIos-DhwWMhje.js";import"./translation-BbB-X6VE.js";import"./Modal-D-azSMDI.js";import"./Portal-BBdVG2wg.js";import"./Backdrop-DD-gpDbJ.js";import"./styled-D-f3nXPd.js";import"./ExpandMore-C6Mhxlcv.js";import"./useAsync-BHSls4pI.js";import"./useMountedState-_2JBp57D.js";import"./AccordionDetails-BN2GJL41.js";import"./index-B9sM2jn7.js";import"./Collapse-CDOt8OKU.js";import"./ListItem-iQvf4R9D.js";import"./ListContext-CAawvRLi.js";import"./ListItemIcon-DWF2K_ea.js";import"./ListItemText-DVmeYJoC.js";import"./Tabs-C-hh6sMN.js";import"./KeyboardArrowRight-C_sLnws1.js";import"./FormLabel-BEdxuTrc.js";import"./formControlState-Brmuclvu.js";import"./InputLabel-4uKWqoJ1.js";import"./Select-n55O9fGR.js";import"./Popover-wogxwwQM.js";import"./MenuItem-CAk4XHik.js";import"./Checkbox-zbHs7eq1.js";import"./SwitchBase-ZcEe9Ifh.js";import"./Chip-BxAsH86O.js";import"./Link-DTnbaAdV.js";import"./index-Co_R5sG-.js";import"./lodash-hyEQ1H7W.js";import"./WebStorage-CP-eCVrl.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CUMvUbgu.js";import"./useIsomorphicLayoutEffect-CP_QP4mj.js";import"./BUIProvider-DGmJlo30.js";import"./openLink-Cp11RzW3.js";import"./useResolvedHref-BKljqgpW.js";import"./Search-BgnC32ll.js";import"./useDebounce-B1PiWddk.js";import"./InputAdornment-Hk0wyak9.js";import"./TextField-eYUugvF6.js";import"./useElementFilter-D3nYHeP7.js";import"./EmptyState-w5Xsgv9K.js";import"./Progress-B0Q7oOWN.js";import"./LinearProgress-DbjXy8Xe.js";import"./ResponseErrorPanel-DdIHmZTa.js";import"./ErrorPanel-CIQvkSTN.js";import"./WarningPanel-Bvd6rA2I.js";import"./MarkdownContent-9KWtBTkf.js";import"./CodeSnippet-CoqYPbYO.js";import"./CopyTextButton-DeFjebyr.js";import"./useCopyToClipboard-qYVd_dE6.js";import"./Tooltip-DUwPyMWo.js";import"./Popper-CZkon0U5.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
