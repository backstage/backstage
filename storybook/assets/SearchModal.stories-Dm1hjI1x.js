import{bR as t,u as d,l as u,a5 as h}from"./iframe-BhJ5Dr2k.js";import{r as g}from"./plugin-BtEdzdTE.js";import{S as m,u as n,b as x}from"./useSearchModal-CX2iWooz.js";import{B as c}from"./Button-DJugJdqz.js";import{c as S,b as f,a as M}from"./DialogTitle-DnRZigSq.js";import{B as j}from"./Box-Y2xnXHg0.js";import{S as r}from"./Grid-DDRFl87z.js";import{S as C}from"./SearchType-CD-VeIAC.js";import{L as y}from"./List-CgBnxwYg.js";import{H as R}from"./DefaultResultListItem-PFTf3D0i.js";import{O as I}from"./appWrappers-DZ1e1OUP.js";import{m as B}from"./makeStyles-DYyKjhyQ.js";import{s as D,M as b}from"./api-BGG5rh-j.js";import{S as k}from"./SearchContext-BjEB6-BP.js";import{SearchBar as v}from"./SearchBar-BRYDa8IE.js";import{S as T}from"./SearchResult-CM0joWW1.js";import"./preload-helper-PPVm8Dsz.js";import"./index-2UJFVvbi.js";import"./Plugin-BdU_nQsT.js";import"./componentData--nZCd31p.js";import"./useAnalytics-DNfXVerI.js";import"./useApp-CYIhR5HZ.js";import"./useRouteRef-CSdurrC0.js";import"./ArrowForward-DrvWPx9h.js";import"./translation-BT3jjpIL.js";import"./Page-1gW46dgQ.js";import"./useMediaQuery-DG-bsxsF.js";import"./Divider-DUf9-sOW.js";import"./ArrowBackIos-JcNpeCck.js";import"./ArrowForwardIos-eCdKybsC.js";import"./translation-1_I3OAKY.js";import"./Modal-BCl5pik5.js";import"./Portal-wkxcFvaf.js";import"./Backdrop-Dmvdhia3.js";import"./styled-w-HNwOwS.js";import"./ExpandMore-BKKO7hh3.js";import"./useAsync-D3NzWMPA.js";import"./useMountedState-C_QJXoN6.js";import"./AccordionDetails-B7ZvhU_V.js";import"./index-B9sM2jn7.js";import"./Collapse-pJkUGgh5.js";import"./ListItem-C_QyLOpG.js";import"./ListContext-f6zilHA_.js";import"./ListItemIcon-BViKiT2-.js";import"./ListItemText-BMtWvFgB.js";import"./Tabs-CGad9anM.js";import"./KeyboardArrowRight-CIFQlVNH.js";import"./FormLabel-EGQ9tJa2.js";import"./formControlState-BHycfnBI.js";import"./InputLabel-y1SR3PLG.js";import"./Select-Bh8KHDzv.js";import"./Popover-BIoVk5SI.js";import"./MenuItem-B1yXeIUy.js";import"./Checkbox-BOT830k_.js";import"./SwitchBase-BRWNHgFK.js";import"./Chip-CTRiO5UY.js";import"./Link-CC_KtSOn.js";import"./index--C479yzh.js";import"./lodash-B1ZVbPgx.js";import"./WebStorage-CaoivIHi.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D8NiOlL6.js";import"./useIsomorphicLayoutEffect-YYL9lDEi.js";import"./BUIProvider-8GiJ_lIH.js";import"./openLink-aBKtIEgX.js";import"./useResolvedHref-DJpYoCAE.js";import"./Search-BnkRKpoY.js";import"./useDebounce-B6gA7Nhc.js";import"./InputAdornment-Cjj1sODs.js";import"./TextField-Kh67Ms6T.js";import"./useElementFilter-BVe_3C8B.js";import"./EmptyState-DtlfzD0W.js";import"./Progress-CAmgriB_.js";import"./LinearProgress-9cp4pMiw.js";import"./ResponseErrorPanel-BMirLRUj.js";import"./ErrorPanel-D4FsxPlh.js";import"./WarningPanel-BEp5BZIq.js";import"./MarkdownContent-COPR2F0H.js";import"./CodeSnippet-B8NGtC5C.js";import"./CopyTextButton-DoIKDSbP.js";import"./useCopyToClipboard-DfFPONnd.js";import"./Tooltip-cVotykzK.js";import"./Popper-FZP7SLCD.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
